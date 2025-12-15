using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;
using System.IO;
using System.Threading.Tasks;

namespace Dexie_typesafe_recorder.Typers
{
    internal static class Intellisense
    {
        public static int IntellisenseMoveDelay { get; set; } = 150;

        private static int GetIntellisenseMoveDelay(int? delay)
        {
            return delay ?? IntellisenseMoveDelay;
        }

        public static Task ShowIntellisense(int? delay = null)
        {
            return Typer.Type(".", delay);
        }

        public static async Task SelectSelectedOption(int? delay = null)
        {
            Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.ENTER);
            await Task.Delay(GetIntellisenseMoveDelay(delay));
        }

        public static async Task DownAndSelect(int times, int? delay = null)
        {
            await IntellisenseDown(times, delay);
            await SelectSelectedOption(delay);
        }

        public static async Task ShowDownAndSelect(int times, int? intellisensePause = null, int? delay = null)
        {
            await ShowIntellisense(intellisensePause);
            await DownAndSelect(times, delay);

        }
        public static Task IntellisenseDown(int times, int? delay = null)
        {
            var d = GetIntellisenseMoveDelay(delay);
            return Typer.MoveDown(times, d);
        }

        public static async Task CtrlSpace(int? delay = null)
        {
            var d = GetIntellisenseMoveDelay(delay);
            Keyboard.TypeSimultaneously(VirtualKeyShort.CONTROL, VirtualKeyShort.SPACE);
            await Task.Delay(d);
        }

        public static async Task Rename(string renameTo, int? delay = null)
        {
            Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.F2);
            await Task.Delay(1000);
            await Typer.Type(renameTo, delay);
            await Typer.Enter();
        }

        public static async Task ShowProblem()
        {
            Keyboard.TypeSimultaneously(
                VirtualKeyShort.CONTROL,
                VirtualKeyShort.KEY_K
            );
            await Task.Delay(75);
            Keyboard.TypeSimultaneously(
                VirtualKeyShort.CONTROL,
                VirtualKeyShort.KEY_I
            );
        }
    }
}
