using System.IO;
using System.Reflection;

namespace Dexie_typesafe_recorder
{
    internal static class ExecutingAssembly
    {
        public static DirectoryInfo GetDirectoryInfo()
        {
            var assemblyLocation = Assembly.GetExecutingAssembly().Location;
            return new DirectoryInfo(Path.GetDirectoryName(assemblyLocation)!);
        }
    }
}
