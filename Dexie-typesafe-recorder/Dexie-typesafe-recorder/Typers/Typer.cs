using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;

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

        public  static Task TypeQuote(int? delay = null)
        {
            return Type("\"", delay);
        }

        public static async Task MoveDown(int times, int delay)
        {
            for (var i = 0; i < times; i++)
            {
                Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.DOWN);
                await Task.Delay(delay);
            }
        }

        public static async Task NewLine()
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
    }
}
