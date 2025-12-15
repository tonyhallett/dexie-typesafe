using System.Diagnostics;
using System.IO;

namespace Dexie_typesafe_recorder.Utils
{
    internal static class DirectoryExtensions {
        extension(DirectoryInfo dirInfo)
        {
            public void OpenInWindowsExplorer()
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "explorer.exe",
                    Arguments = dirInfo.FullName,
                    UseShellExecute = true
                });
            }
        }
    }
}
