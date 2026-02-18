import path from "node:path";

async function convertVideo(filePath: string) {
	const outputPath = `${filePath}-convert.mp4`;
	console.log(`変換中: ${filePath}`);

	const command = new Deno.Command("ffmpeg", {
		args: [
			"-i",
			filePath,
			"-c:v",
			"libx265",
			"-preset",
			"slow",
			"-crf",
			"20",
			"-b:a",
			"128k",
			"-map",
			"0:v:0",
			"-map",
			"0:a?",
			"-map_metadata",
			"-1",
			"-threads",
			"1",
			outputPath
		],
		stdout: "inherit",
		stderr: "inherit"
	});
	const child = command.spawn();
	const status = await child.status;
	if (!status.success) {
		console.error(`変換に失敗しました: ${filePath}`);
	}
}

const inputRaw = prompt("Video Path:");
const input = inputRaw?.trim().replace(/^"+|"+$/g, "");
if (input === undefined) {
	console.error("パスが入力されていません。");
	Deno.exit(1);
}

try {
	const fileInfo = await Deno.stat(input);

	if (fileInfo.isDirectory) {
		const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
		for await (const entry of Deno.readDir(input)) {
			if (entry.isFile && videoExtensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
				const fullPath = path.join(input, entry.name);
				await convertVideo(fullPath);
			}
		}
	} else {
		await convertVideo(input);
	}
} catch (e) {
	console.error(e);
}

prompt("処理が完了しました。Enterキーを押して終了してください...");
