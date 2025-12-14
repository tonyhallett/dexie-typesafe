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
                EditorVideoRecorderToReadmeAssets.Start(editor, ffmpegPath);
            }
            await demo.TypeAsync();
            automation.Dispose();
            if (dryRun)
            {
                return;
            }
            var recordingDetails = EditorVideoRecorderToReadmeAssets.Stop();
            
            ConvertVideoToGif(recordingDetails.VideoPath, demo.GifName);
        }

        private static void ConvertVideoToGif(string videoPath, string gifName)
        {
            var gifPath = GetGifPath(videoPath, gifName);
            AviToGifConverter.ConvertAviToGif(ffmpegPath, videoPath, gifPath);
            File.Delete(videoPath);
        }

        private static string GetGifPath(string aviPath, string gifName)
        {
            string? videoDirectory = Path.GetDirectoryName(aviPath);
            
            return Path.Combine(videoDirectory!, $"{gifName}.gif");
        }
    }
}
