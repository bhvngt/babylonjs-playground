import { type ISceneLoaderProgressEvent, SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { AssetContainer } from "@babylonjs/core/AssetContainer";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { type Writable, writable } from "svelte/store";
import { omit, zipObject } from "lodash-es";

type ProgressHandlerParams = Partial<{
	loaders: Record<string, ISceneLoaderProgressEvent>; total: number; loaded: number;
}>;
export const loadingProgress: Writable<ProgressHandlerParams> = writable({ total: 0, loaded: 0, loaders: {} });

function onProgress(loaderId: string): (evt: ISceneLoaderProgressEvent) => void {
	return (progressEvt: ISceneLoaderProgressEvent) => {
		const updateProgress = (prevData: ProgressHandlerParams) => {
			const loaders = { ...prevData.loaders, [loaderId]: progressEvt };
			return {
				loaders,
				total: Object.values(loaders).reduce<number>((acc, val: ISceneLoaderProgressEvent) => acc + val.total, 0),
				loaded: Object.values(loaders).reduce<number>((acc, val: ISceneLoaderProgressEvent) => acc + val.loaded, 0)
			};
		};
		if (progressEvt.lengthComputable) loadingProgress.update(updateProgress);
	};
}

export default class AssetCreator {
	readonly #scene: Scene;
	#character: AbstractMesh;
	#characterContainer: AssetContainer;
	#assetContainers: Awaited<Record<string, AssetContainer>>;

	private constructor(scene: Scene) {
		this.#scene = scene;
	}

	public static async create(scene: Scene, characterFileUrl: string, animationPathMap: Record<string, string>): Promise<AssetCreator> {
		const assetCreator = new AssetCreator(scene)
		const assetPathMap = { char: characterFileUrl, ...animationPathMap };
		const assetLoaders = Object.entries(assetPathMap).map(([name, fileUrl]) => SceneLoader.LoadAssetContainerAsync(fileUrl, undefined, scene, onProgress(name)));
		assetCreator.#assetContainers = await Promise.all(assetLoaders).then(assetContainers => zipObject(Object.keys(assetPathMap), assetContainers))
		return assetCreator;
	}

	public setupCharacter(): { character: TransformNode; bindPoseOffset: AnimationGroup } {
		if (!this.#assetContainers) throw new Error("Please call method loadAssets before setting up character");
		this.#characterContainer = this.#assetContainers.char;
		const [character] = this.#characterContainer.meshes;
		this.#character = character;
		const [bindPoseOffset] = this.#characterContainer.animationGroups;
		if (bindPoseOffset) {
			AnimationGroup.MakeAnimationAdditive(bindPoseOffset);
		}
		// Add everything to the scene
		this.#characterContainer.addAllToScene();
		return { character: this.#character, bindPoseOffset };
	}

	public setupAnimation(): Record<string, AnimationGroup[]> {
		if (!this.#assetContainers) throw new Error("Please call method loadAssets before setting up animations");
		const animContainers = omit(this.#assetContainers, ["char"]);
		// Load animation
		const children = this.#character.getDescendants(false);
		const clips = Object.values(animContainers).map((container) => {
			const startingIndex = this.#scene.animatables.length;
			const firstIndex = this.#scene.animationGroups.length;
			// Apply animation to character
			container.mergeAnimationsTo(this.#scene, this.#scene.animatables.slice(startingIndex), (target) => children.find((c) => c.name === target.name) || null);
			// Find the new animations and destroy the container
			const animations = this.#scene.animationGroups.slice(firstIndex);
			// container.dispose();
			this.#scene.onAnimationFileImportedObservable.notifyObservers(this.#scene);
			return animations;
		});
		// const resolvedClips = await Promise.all<AnimationGroup[]>(clips);
		return zipObject(Object.keys(animContainers), clips);
	}

	public generateShadow(): void {
		const dirLight = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), this.#scene);
		dirLight.position = new Vector3(0, 5, 5);

		// Shadows
		const shadowGenerator = new ShadowGenerator(1024, dirLight);
		shadowGenerator.useBlurExponentialShadowMap = true;
		shadowGenerator.blurKernel = 3;

		shadowGenerator.addShadowCaster(this.#character, true);
		this.#characterContainer.meshes.forEach((m) => (m.receiveShadows = false));
	}
}
