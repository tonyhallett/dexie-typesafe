namespace Dexie_typesafe_recorder.Typers
{
    static class FunctionTyper {
        public static Task TypeParameterOpeningBracket(int? delay = null)
        {
            return Typer.Type("(", delay);
        }

        public static Task TypeParameterClosingBracket(int? delay = null)
        {
            return Typer.Type(")", delay);
        }

        public static Task Comma()
        {
            return Typer.Type(", ");
        }

        public static async Task PickIntellisenseMethodSuggestFirstStringParameter(int functionIndex)
        {
            await Intellisense.ShowDownAndSelect(functionIndex, 1000);
            await TypeParameterOpeningBracket();
            await Typer.TypeQuote();
            await Task.Delay(1000);
        }

        public static async Task PickIntellisenseStringArgument(int optionIndex)
        {
            await Intellisense.DownAndSelect(optionIndex);
            await Typer.TypeQuote();
        }

        public static async Task PickIntellisenseMethodAndStringArgument(int methodIntellisenseIndex, int parameterIntellisenseIndex)
        {
            await PickIntellisenseMethodSuggestFirstStringParameter(methodIntellisenseIndex);
            await PickIntellisenseStringArgument(parameterIntellisenseIndex);
        }

        public static async Task PickIntellisenseMethodAndSingleStringParameter(int methodIntellisenseIndex, int parameterIntellisenseIndex)
        {
            await PickIntellisenseMethodAndStringArgument(methodIntellisenseIndex, parameterIntellisenseIndex);

            await TypeParameterClosingBracket();
        }

        public static async Task PickAdditionalIntellisenseStringArgument(int optionIndex)
        {
            await Comma();

            await Typer.TypeQuote();
            await PickIntellisenseStringArgument(optionIndex);
        }
    }
}
