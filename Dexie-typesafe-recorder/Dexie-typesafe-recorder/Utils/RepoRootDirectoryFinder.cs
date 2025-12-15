using System.IO;

namespace Dexie_typesafe_recorder.Utils
{
    internal static class RepoRootDirectoryFinder {
        public static DirectoryInfo FindTopDirectory(string rootDirectoryName)
        {
            return GetRepoRoot().GetDirectories(rootDirectoryName, SearchOption.TopDirectoryOnly)[0];
        }
        private static DirectoryInfo GetRepoRoot()
        {
            var searchDirectory = ExecutingAssembly.GetDirectoryInfo();
            while (searchDirectory.Parent != null)
            {
                if (searchDirectory.GetDirectories(".git").Length > 0)
                {
                    return searchDirectory;
                }
                searchDirectory = searchDirectory.Parent;
            }
            throw new DirectoryNotFoundException("Could not find repo root");
        }

    }
}
