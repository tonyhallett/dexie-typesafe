using Dexie_typesafe_recorder.Demos;
using Dexie_typesafe_recorder.VsCode;
using System.IO;
using FlauVideoRecorder = FlaUI.Core.Capturing.VideoRecorder;

namespace Dexie_typesafe_recorder
{
    internal static class Recorder
    {
        public static async Task RecordAsync(IDemo demo, bool dryRun = false)
        {
            var ffmpegPath = await FlauVideoRecorder.DownloadFFMpeg("C:\\temp");
            var editor = VsCodeAutomation.GetVsCodeEditor();
            editor.Focus();
            if (!dryRun)
            {
                EditorVideoRecorderToReadmeAssets.Start(editor.BoundingRectangle, ffmpegPath);
            }

            await demo.TypeAsync();
            await Task.Delay(1000);
            
            if (dryRun)
            {
                return;
            }

            var recordingDetails = EditorVideoRecorderToReadmeAssets.Stop();
            
            ConvertVideoToGif(recordingDetails.VideoPath, demo.GifName, ffmpegPath);
        }

        private static void ConvertVideoToGif(string videoPath, string gifName,  string ffmpegPath)
        {
            var gifPath = GetGifPath(videoPath, gifName);
            AviToGifConverter.ConvertAviToGif(ffmpegPath, videoPath, gifPath);
            File.Delete(videoPath);

            string GetGifPath(string aviPath, string gifName)
            {
                string? videoDirectory = Path.GetDirectoryName(aviPath);

                return Path.Combine(videoDirectory!, $"{gifName}.gif");
            }
        }
    }
}
