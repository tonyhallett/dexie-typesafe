using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace Dexie_typesafe_recorder
{
    internal static class AviToGifConverter
    {
        public static void ConvertAviToGif(string ffmpegPath, string inputAvi, string outputGif)
        {
            string arguments = $"-y -i \"{inputAvi}\" \"{outputGif}\"";

            var processStartInfo = new ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using var process = new Process { StartInfo = processStartInfo };
            _ = process.Start();
            string stderr = process.StandardError.ReadToEnd(); // FFmpeg logs to stderr
            process.WaitForExit();

            if (process.ExitCode == 0)
            {
                return;
            }

            throw new Exception($"FFmpeg failed with exit code {process.ExitCode}: {stderr}");
        } 
    }
}

