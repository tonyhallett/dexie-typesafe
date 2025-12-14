using FlaUI.Core.AutomationElements;
using FlaUI.Core.Capturing;
using System.IO;
using FlauVideoRecorder = FlaUI.Core.Capturing.VideoRecorder;

namespace Dexie_typesafe_recorder
{
    internal static class  EditorVideoRecorderToReadmeAssets
    {
        private static FlauVideoRecorder? s_videoRecorder;
        private static RecordingDetails? s_recordingDetails;

        public static void Start(AutomationElement editor, string ffmpegPath)
        {
            var readmeAssetsDirectory = RepoRootDirectoryFinder.FindTopDirectory("readme-assets");
            var videoPath = Path.Combine(readmeAssetsDirectory.FullName, "recording.avi");
            s_recordingDetails = new RecordingDetails(readmeAssetsDirectory, videoPath);

            var videoRecorderSettings = new VideoRecorderSettings
            {
                VideoFormat = VideoFormat.xvid,
                VideoQuality = 6,
                TargetVideoPath = videoPath,
                LogMissingFrames = false,
                ffmpegPath = ffmpegPath,
            };

            s_videoRecorder = new FlauVideoRecorder(
                videoRecorderSettings,
                (_) => Capture.Rectangle(editor.BoundingRectangle));
        }

        public static RecordingDetails Stop()
        {
            s_videoRecorder?.Stop();
            return s_recordingDetails!;
        }

    }
}
