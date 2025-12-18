using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    internal class UpgradeDemo : IDemo
    {
        public string GifName { get; } = "UpgradeDemo";
        public async Task TypeAsync()
        {
            // start with cursor on Friends
            await RenameFriendsToV1();
            await AddNewFriendInterface();
            await UpgradeToV2();
            await CreateConverterFn();
            await ChangeOnPopulateToDbV2();
            //await CtxValueConverted();
            //await DemoSchemaChange();
            //await ChangeToExportDbv2();

        }

        private Task RenameFriendsToV1() => Intellisense.Rename("FriendsV1");

        private async Task AddNewFriendInterface() {
            await Typer.MoveDown(12);
            await Typer.Type("""

interface Friend {
  id: number;
  firstName: string;
  lastName: string;
}

""");
            await Typer.NewLine();
        }

        private Task  UpgradeToV2()
        {
            return Typer.Type("""
const dbV2 = upgrade(dbV1, {
  toDelete: null,
  friends: tableBuilder<Friend>().autoPkey("id").index("firstName").index("lastName").build(),
}, tx => {
  return tx.friends.toCollection().modify((friendV1, ctx) => {

  });
});

""");
        }

        private Task CreateConverterFn()
        {
            return Typer.Type("""
const converter: TableInboundUpgradeConverter<typeof dbV1.friends, typeof dbV2.friends> = (friendV1) => {
  const nameParts = friendV1.name.split(" ");
  return {
    firstName: nameParts[0]!,
    lastName: nameParts[1],
  };
};
""");
        }

        private async Task ChangeOnPopulateToDbV2()
        {
            await Typer.MoveDown(1);
            await Typer.MoveRight(4);
            await Typer.Backspace(1);
            await Typer.Type("2");
            await DeletePopulateDeletedTable();
            // await MapSeedToConverter();
        }

        private async Task DeletePopulateDeletedTable()
        {
            await Typer.MoveDown(3);
            // need new Typer.DeleteLine();
        }

        private async Task MapSeedToConverter()
        {
            await Task.CompletedTask;
            //change to  tx.friends.bulkAdd(friendsSeed.map(converter));
        }

        private async Task CtxValueConverted()
        {
            //move up and ctx.value = converter(friendV1)
            await Task.CompletedTask;
        }

        private async Task ChangeToExportDbv2()
        {
            await Task.CompletedTask;
        }

        private async Task DemoSchemaChange()
        {
            await Task.CompletedTask;
            //await Typer.Type("dbV2.friends.where(\"");
            //await Task.Delay(2000);
            //await Typer.Backspace(15);
            //await Typer.Type("toDel");
            //await Task.Delay(1000);
            //await Typer.Backspace(10);
            //await Typer.MoveDown(1);
            //await Typer.CtrlRightArrow(5);
            //await Typer.Backspace(1);
            //await Typer.Type("2");
        }
    }
}
