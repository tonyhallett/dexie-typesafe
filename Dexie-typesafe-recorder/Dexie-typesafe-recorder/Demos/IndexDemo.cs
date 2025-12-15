using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    class IndexDemo : IDemo
    {
        public string GifName { get; } = "IndexDemo";

        public async Task TypeAsync()
        {
            // index
            await FunctionTyper.PickIntellisenseMethodAndSingleStringParameter(2, 3);
            // index
            await FunctionTyper.PickIntellisenseMethodAndSingleStringParameter(2, 3);
            await NewlineAndTab();
            // multi
            await FunctionTyper.PickIntellisenseMethodAndSingleStringParameter(3, 0);
            await NewlineAndTab();

            await TypeCompound();
        }

        private static async Task NewlineAndTab()
        {
            await Typer.NewLine();
            await Typer.Tab();
        }

        private static async Task TypeCompound()
        {
            await FunctionTyper.PickIntellisenseMethodAndStringArgument(1, 1);
            await FunctionTyper.PickAdditionalIntellisenseStringArgument(2);
            await FunctionTyper.TypeParameterClosingBracket();
        }

    }
}
