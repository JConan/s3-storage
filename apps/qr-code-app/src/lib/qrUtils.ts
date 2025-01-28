import QRCode from 'qrcode';

export async function generateQRWithLogo(
	data: string,
	logoUrl: string,
	options = {}
): Promise<string> {
	const qrOptions = {
		errorCorrectionLevel: 'H',
		margin: 1,
		color: {
			dark: '#000000',
			light: '#ffffff'
		},
		...options
	};

	const qrDataUrl = await QRCode.toDataURL(data, qrOptions);

	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		const logo = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;

			if (ctx) {
				ctx.drawImage(img, 0, 0);

				// Draw logo in center
				const logoSize = Math.min(img.width, img.height) * 0.2;
				const x = (img.width - logoSize) / 2;
				const y = (img.height - logoSize) / 2;

				logo.onload = () => {
					ctx.drawImage(logo, x, y, logoSize, logoSize);
					resolve(canvas.toDataURL());
				};

				logo.src = logoUrl;
			}
		};

		img.src = qrDataUrl;
	});
}
