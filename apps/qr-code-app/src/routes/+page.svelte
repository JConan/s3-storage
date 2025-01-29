<script lang="ts">
	import QRCodeStyling from 'qr-code-styling';
	import QRForm from '../lib/QRForm.svelte';

	let dialog: HTMLDialogElement;
	let qrCodeContainer: HTMLDivElement;
	let qrCode: QRCodeStyling | undefined = $state();

	function generateQrCode(resourceUrl: string, logoUrl: string) {
		qrCode = new QRCodeStyling({
			width: 300,
			height: 300,
			data: resourceUrl,
			image: logoUrl,
			dotsOptions: {
				color: '#000',
				type: 'extra-rounded' // Can be 'square', 'dots', 'rounded', etc.
			},
			backgroundOptions: {
				color: '#fff'
			},
			imageOptions: {
				crossOrigin: 'anonymous',
				margin: 10 // Adjusts the padding around the logo
			}
		});
		qrCodeContainer.innerHTML = '';
		qrCode.append(qrCodeContainer);
		dialog.showModal();
	}

	async function onGenerate({ resourceFile, logoFile }: { resourceFile: File; logoFile: File }) {
		const targetPath = `/buckets/resources/files/${resourceFile.name}`;
		const formData = new FormData();
		formData.append('file', resourceFile); // Append the file

		const response = await fetch(targetPath, {
			method: 'PUT',
			body: formData
		});

		if (response.status === 200) {
			const resourceUrl = new URL(targetPath, window.location.origin).href;
			const logoUrl = URL.createObjectURL(logoFile);
			generateQrCode(resourceUrl, logoUrl);
		} else {
			console.log({ error: await response.json() });
		}
	}
</script>

<svelte:document
	onclick={() => {
		if (dialog.open) dialog.close();
	}}
/>

<dialog
	bind:this={dialog}
	class="m-auto fixed inset-0 flex items-center justify-center bg-transparent"
>
	<div bind:this={qrCodeContainer}></div>
</dialog>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
	<QRForm {onGenerate} />
</div>

<style>
	dialog {
		display: none;
		background-color: white;
		padding: 1rem;
		border-radius: 1rem;
	}

	dialog[open] {
		display: block;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(5px);
	}
</style>
