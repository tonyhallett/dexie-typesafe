using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    class TableBuilderMaxDepthDemo : IDemo
    {
        public string GifName { get; } = "TableBuilderMaxDepthDemo";

        public async Task TypeAsync()
        {
            await PkeySuggestFirstParameter();
            await Typer.Backspace(13);
            await Typer.Type("I\" }>()");
            await PkeySuggestFirstParameter();
            await Typer.Backspace(13);
            await Typer.Type("I\" }>()");
            await PkeySuggestFirstParameter();
            await FunctionTyper.PickIntellisenseStringArgument(1);
            await FunctionTyper.TypeParameterClosingBracket();
        }

        private static  Task PkeySuggestFirstParameter()
        {
            return FunctionTyper.PickIntellisenseMethodSuggestFirstStringParameter(TableBuilderIndexes.PkeyMethodIndex);
        }
    }
}
