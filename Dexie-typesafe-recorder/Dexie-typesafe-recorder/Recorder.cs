using System.IO;
using FlauVideoRecorder = FlaUI.Core.Capturing.VideoRecorder;

namespace Dexie_typesafe_recorder
{
    internal static class Recorder
    {
        private static readonly string ffmpegPath = "C:\\temp\\ffmpeg.exe";
        private static async Task EnsureFFmpeg()
        {
            if (!File.Exists(ffmpegPath))
            {
                await FlauVideoRecorder.DownloadFFMpeg("C:\\temp");
            }
        }

        public static async Task RecordAsync(IDemo demo, bool dryRun = false)
        {
            await EnsureFFmpeg();
            var (editor, automation) = VsCodeAutomation.GetVsCodeEditor();
            editor.Focus();
            if (!dryRun)
            {
                EditorVideoRecorderToTempDirectory.Start(editor, ffmpegPath);
            }
            await demo.TypeAsync();
            automation.Dispose();
            if (dryRun)
            {
                return;
            }
            var recordingDetails = EditorVideoRecorderToTempDirectory.Stop();
            
            recordingDetails.TempDirectory.OpenInWindowsExplorer();

            ConvertVideoToGif(recordingDetails.VideoPath);
        }

        private static void ConvertVideoToGif(string videoPath)
        {
            var gifPath = GetGifPath(videoPath);
            AviToGifConverter.ConvertAviToGif(ffmpegPath, videoPath, gifPath);
        }

        private static string GetGifPath(string aviPath)
        {
            string? videoDirectory = Path.GetDirectoryName(aviPath);
            string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(aviPath);
            return Path.Combine(videoDirectory!, $"{fileNameWithoutExtension}.gif");
        }
    }
}
