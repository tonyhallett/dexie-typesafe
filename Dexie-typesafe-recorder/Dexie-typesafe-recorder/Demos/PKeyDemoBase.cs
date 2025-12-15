using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    abstract class PKeyDemoBase : IDemo
    {
        public abstract string GifName { get;}

        public abstract int MethodIntellisenseIndex { get; }

        public async Task TypeAsync()
        {
            await TypeTableBuilder();
            await FunctionTyper.PickIntellisenseMethodSuggestFirstStringParameter(MethodIntellisenseIndex);
            
            await PickParameters();
            await FunctionTyper.TypeParameterClosingBracket();
        }

        private static Task TypeTableBuilder()
        {
            return Typer.Type("tableBuilder<TableItem>()");
        }

        protected abstract Task PickParameters();
    }
}
