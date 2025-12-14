namespace Dexie_typesafe_recorder.Demos
{
    abstract class PKeyDemoBase : IDemo
    {
        public abstract string GifName { get;}
        public abstract int MethodIntellisenseIndex { get; }

        public async Task TypeAsync()
        {
            await TypeTableBuilder();
            await FunctionTyper.PickIntellisenseMethodSuggestFirstParameter(MethodIntellisenseIndex);
            
            await PickParameters();
            await Typer.TypeParameterClosingBracket();
            await Task.Delay(1000);
        }



        private Task TypeTableBuilder()
        {
            return Typer.Type("tableBuilder<TableItem>()");
        }
        protected abstract Task PickParameters();
    }
}
