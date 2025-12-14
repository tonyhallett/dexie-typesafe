namespace Dexie_typesafe_recorder.Demos
{
    class IndexDemo : IDemo
    {
        public string GifName { get; } = "IndexDemo";

        public async Task TypeAsync()
        {
            // index
            await TypeSingleParameterMethod(2, 3);
            // index
            await TypeSingleParameterMethod(2, 3);
            await NewlineAndTab();
            // multi
            await TypeSingleParameterMethod(3, 0);
            await NewlineAndTab();

            await TypeCompound();
            await Task.Delay(1000);

        }

        private async Task NewlineAndTab()
        {
            await Typer.NewLine();
            await Typer.Tab();
        }

        private async Task TypeMethodFirstParameter(int methodIntellisenseIndex, int parameterIntellisenseIndex)
        {
            await FunctionTyper.PickIntellisenseMethodSuggestFirstParameter(methodIntellisenseIndex);
            await Typer.IntellisenseDownAndSelect(parameterIntellisenseIndex);
            await Typer.TypeClosingQuote();
        }

        private async Task TypeSingleParameterMethod(int methodIntellisenseIndex, int parameterIntellisenseIndex)
        {
            await TypeMethodFirstParameter(methodIntellisenseIndex, parameterIntellisenseIndex);

            await Typer.TypeParameterClosingBracket();
        }

        private async Task TypeCompound()
        {
            await TypeMethodFirstParameter(1, 1);
            await FunctionTyper.PickAdditionalParameter(2);
            await Typer.TypeParameterClosingBracket();
        }

    }
}
