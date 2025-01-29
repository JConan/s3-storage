<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		onGenerate: (inputs: { resourceFile: File; logoFile: File }) => Promise<void> | void;
	}
	const { onGenerate }: Props = $props();

	let resourceFile = $state(null as FileList | null);
	let logoFile = $state(null as FileList | null);
	let resourcePreview: string | null = $state(null);
	let logoPreview: string | null = $state(null);
	let formValid = $derived(resourceFile?.length && logoFile?.length);
	let form: HTMLFormElement;

	onMount(() => {
		form.reset();
	});

	const handleFileChange = (event: Event, type: 'resource' | 'logo') => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (type === 'resource') {
					resourcePreview = e.target?.result as string;
				} else {
					logoPreview = e.target?.result as string;
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (formValid) onGenerate({ resourceFile: resourceFile![0], logoFile: logoFile![0] });
	};
</script>

<div class="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
	<form bind:this={form} onsubmit={handleSubmit} class="max-w-4xl mx-auto grid grid-rows-2 gap-12">
		<div class="grid grid-cols-2 gap-8">
			<label class="block text-sm font-medium text-gray-700 mb-2">
				<div
					class="w-[300px] h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white"
				>
					{#if resourcePreview}
						<img
							src={resourcePreview}
							alt="Resource preview"
							class="w-full h-full object-contain"
						/>
					{:else}
						<p>Resource (images, videos, documents)</p>
						<span class="text-gray-400">Select a file</span>
					{/if}
				</div>
				<input
					type="file"
					bind:files={resourceFile}
					onchange={(e) => handleFileChange(e, 'resource')}
					accept="image/*, video/*, application/pdf, .doc, .docx, .xls, .xlsx"
					class="invisible"
				/>
			</label>

			<label for="logo" class="block text-sm font-medium text-gray-700 mb-2">
				<div
					class="w-[300px] h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white"
				>
					{#if logoPreview}
						<img src={logoPreview} alt="Logo preview" class="w-full h-full object-contain" />
					{:else}
						<p>Logo (images only)</p>
						<span class="text-gray-400">Select a file</span>
					{/if}
				</div>
				<input
					type="file"
					id="logo"
					bind:files={logoFile}
					onchange={(e) => handleFileChange(e, 'logo')}
					accept="image/*"
					class="invisible"
				/>
			</label>

			<button
				type="submit"
				disabled={!formValid}
				class="col-span-2 w-full max-w-xs mx-auto px-6 py-3 bg-linear-to-t from-sky-500 to-indigo-500 bg-slate-400 disabled:bg-none text-white font-semibold rounded-lg shadow-lg hover:enabled:from-purple-700 hover:enabled:to-pink-700 transition-all transform hover:enabled:scale-105"
			>
				Generate QR Code
			</button>
		</div>
	</form>
</div>
