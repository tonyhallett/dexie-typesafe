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
            await CtxValueConverted();
            await ChangeToExportDbv2();
            await DemoSchemaChange();
        }

        private Task RenameFriendsToV1() => Intellisense.Rename("FriendV1");

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

        private async Task  UpgradeToV2()
        {
            await Typer.Type("const dbV2 = upgrade");
            await Task.Delay(1500);
            await Intellisense.QuickFixDownAndSelect(0);
            await Typer.Type("""
(dbV1, {
  toDelete: null,
  friends: tableBuilder<Friend>().autoPkey("id").index("firstName").index("lastName").build(),
}, tx => {
  return tx.friends.toCollection().modify((friendV1, ctx) => {

  });
});

""");
        }

        private async Task CreateConverterFn()
        {
            await Typer.Type("const converter: TableInboundUpgradeConverter");
            await Task.Delay(1500);
            await Intellisense.QuickFixDownAndSelect(0);
            await Typer.Type("""
<typeof dbV1.friends, typeof dbV2.friends> = (friendV1) => {
  const nameParts = friendV1.name.split(" ");
  return {
    firstName: nameParts[0]!,
    lastName: nameParts[1]!,
  };
};
""");
        }

        private async Task ChangeOnPopulateToDbV2()
        {
            await Typer.MoveDown(1);
            await Typer.MoveRight(2);
            await Typer.Backspace(1);
            await Typer.Type("2");
            await MapSeedToConverter();
            await DeletePopulateDeletedTable();
        }



        private async Task MapSeedToConverter()
        {
            await Typer.MoveDown(2);
            await Typer.MoveRight(28);
            await Typer.Type(".map(converter)");
            await Task.CompletedTask;
        }

        private async Task DeletePopulateDeletedTable()
        {
            await Typer.MoveDown(1);
            await Typer.Backspace(39);
        }

        private async Task CtxValueConverted()
        {
            await Typer.MoveUp(12);
            await Typer.Tab(2);
            await Typer.Type("ctx.value = converter(friendV1);");
        }

        private async Task ChangeToExportDbv2()
        {
            await Typer.MoveDown(15);
            await Typer.Backspace(2);
            await Typer.Type("2;");
        }

        private async Task DemoSchemaChange()
        {
            await Typer.MoveDown(1);
            await Typer.Type("db.friends.where(\"");
            await Task.Delay(2000);
            await Typer.Backspace(15);
            await Typer.Type("toDel");
            await Task.Delay(1000);
            await Typer.Backspace(9);
        }
    }
}
