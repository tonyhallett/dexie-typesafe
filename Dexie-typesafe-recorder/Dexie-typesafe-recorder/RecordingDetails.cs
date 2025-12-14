using System.IO;

namespace Dexie_typesafe_recorder
{
    internal class RecordingDetails { 
        public RecordingDetails(DirectoryInfo readmeAssetsDirectory, string videoPath)
        {
            ReadmeAssetsDirectory = readmeAssetsDirectory;
            VideoPath = videoPath;
        }

        public DirectoryInfo ReadmeAssetsDirectory { get; }
        public string VideoPath { get; }
    }
}
