using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;
using System.Windows.Forms;

namespace Dexie_typesafe_recorder.Typers
{
    internal static class Typer
    {
        public static int TypeDelay { get; set; } = 100;

        private static int GetTypeDelay(int? delay)
        {
            return delay ?? TypeDelay;
        }

        public static async Task Type(string toType, int? delay = null)
        {
            var d = GetTypeDelay(delay);
            foreach (var ch in toType)
            {
                switch (ch)
                {
                    case '\r':
                        // ignore, handled by \n
                        break;

                    case '\n':
                        Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.RETURN);
                        await Task.Delay(d);
                        break;

                    default:
                        Keyboard.Type(ch.ToString());
                        await Task.Delay(d);
                        break;
                }
            }
        }

        public static Task TypeQuote(int? delay = null)
        {
            return Type("\"", delay);
        }

        public static Task MoveDown(int times, int? delay = null) => Repeat(VirtualKeyShort.DOWN, times, delay);


        public static Task MoveUp(int times, int? delay = null) => Repeat(VirtualKeyShort.UP, times, delay);


        private static async Task Repeat(VirtualKeyShort virtualKey, int times, int? delay = null)
        {
            var d = GetTypeDelay(delay);
            for (var i = 0; i < times; i++)
            {
                Keyboard.TypeVirtualKeyCode((ushort)virtualKey);
                await Task.Delay(d);
            }
        }

        public static Task NewLine() => Enter();

        public static async Task Enter()
        {
            Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.RETURN);
            await Task.Delay(TypeDelay);
        }

        public static async Task Tab()
        {
            Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.TAB);
        }

        public static async Task Backspace(int count = 1)
        {
            for (var i = 0; i < count; i++)
            {
                Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.BACK);
                await Task.Delay(TypeDelay);
            }
        }

        public static  Task MoveLeft(int times, int? delay = null) => Repeat(VirtualKeyShort.LEFT, times, delay);

        public static Task MoveRight(int times, int? delay = null) => Repeat(VirtualKeyShort.RIGHT, times, delay);

        public static  Task Delete(int times, int? delay = null) => Repeat(VirtualKeyShort.BACK, times, delay);

    }
}
