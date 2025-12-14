using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;
using System.Xml;

namespace Dexie_typesafe_recorder
{
    internal static class Typer
    {
        public static int TypeDelay { get; set; } = 100;

        public static int IntellisenseMoveDelay { get; set; } = 150;

        private static int GetTypeDelay(int? delay)
        {
            return delay ?? TypeDelay;
        }
        private static int GetIntellisenseMoveDelay(int? delay)
        {
            return delay ?? IntellisenseMoveDelay;
        }

        public static async Task Type(string toType, int? delay = null)
        {
            var d = GetTypeDelay(delay);
            foreach (var ch in toType)
            {
                //Keyboard.Type(letter.ToString());
                //await Task.Delay(d);
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

        public static Task TypeParameterOpeningBracket(int? delay = null)
        {
            return Type("(", delay);
        }

        public static Task TypeParameterClosingBracket(int? delay = null)
        {
            return Type(")", delay);
        }

        private  static Task TypeQuote(int? delay = null)
        {
            return Type("\"", delay);
        }

        public static Task TypeOpeningQuote(int? delay = null)
        {
            return TypeQuote(delay);
        }
        public static Task TypeClosingQuote(int? delay = null)
        {
            return TypeQuote(delay);
        }

        public static Task ShowIntellisense(int? delay = null)
        {
            return Type(".", delay);
        }

        public static async Task SelectSelectedIntellisenseOption(int? delay = null)
        {
            Keyboard.TypeVirtualKeyCode((ushort)VirtualKeyShort.ENTER);
            await Task.Delay(GetTypeDelay(delay));
        }

        public static async Task IntellisenseDownAndSelect(int times, int? delay = null)
        {
            await IntellisenseDown(times, delay);
            await SelectSelectedIntellisenseOption(delay);
        }

        public static async Task ShowIntellisenseDownAndSelect(int times,int? intellisensePause = null, int? delay = null)
        {
            await ShowIntellisense(intellisensePause);
            await IntellisenseDownAndSelect(times, delay);

        }
        public static Task IntellisenseDown(int times, int? delay = null)
        {
            var d = GetIntellisenseMoveDelay(delay);
            return MoveDown(times,d);
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

        internal static Task Comma()
        {
            return Type(", ");
        }
    }
}
