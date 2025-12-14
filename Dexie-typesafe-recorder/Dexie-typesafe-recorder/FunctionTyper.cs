namespace Dexie_typesafe_recorder
{
    static class FunctionTyper {
        public static async Task PickIntellisenseMethodSuggestFirstParameter(int functionIndex)
        {
            await Typer.ShowIntellisenseDownAndSelect(functionIndex, 1000);
            await Typer.TypeParameterOpeningBracket();
            await Typer.TypeOpeningQuote();
            await Task.Delay(1000);
        }

        public static async Task PickAdditionalParameter(int parameterIndex)
        {
            await Typer.Comma();

            await Typer.TypeOpeningQuote();
            await Typer.IntellisenseDownAndSelect(parameterIndex);
            await Typer.TypeClosingQuote();
        }
    }
}
