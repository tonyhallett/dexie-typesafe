using System.IO;

namespace Dexie_typesafe_recorder
{
    internal class RecordingDetails { 
        public RecordingDetails(DirectoryInfo tempDirectory, string videoPath)
        {
            TempDirectory = tempDirectory;
            VideoPath = videoPath;
        }

        public DirectoryInfo TempDirectory { get; }
        public string VideoPath { get; }
    }
}
