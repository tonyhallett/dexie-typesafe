using FlaUI.Core.AutomationElements;
using FlaUI.Core.Capturing;
using System.IO;
using FlauVideoRecorder = FlaUI.Core.Capturing.VideoRecorder;

namespace Dexie_typesafe_recorder
{
    internal static class  EditorVideoRecorderToTempDirectory
    {
        private static FlauVideoRecorder? s_videoRecorder;
        private static RecordingDetails? s_recordingDetails;

        public static void Start(AutomationElement editor, string ffmpegPath)
        {
            var temp = Directory.CreateTempSubdirectory();
            var videoPath = Path.Combine(temp.FullName, "recording.avi");
            s_recordingDetails = new RecordingDetails(temp, videoPath);

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
