namespace Dexie_typesafe_recorder.Demos
{
    interface IDemo {
        string GifName { get; }
        Task TypeAsync();
    }
}
