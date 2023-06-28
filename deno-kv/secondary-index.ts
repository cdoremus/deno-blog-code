/**
 * Demos a one-to-many secondary index
 */

import { deleteAllRecords } from "./util.ts";

type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

interface Player {
  id?: string;
  name: string;
  position: Position;
}

// Players on the Liverpool Premier League team
const players: Player[] = [
  {
    "name": "Alisson Becker",
    "position": "Goalkeeper",
  },
  {
    "name": "Trent Alexander-Arnold",
    "position": "Defender",
  },
  {
    "name": "Virgil van Dijk",
    "position": "Defender",
  },
  {
    "name": "Joel Matip",
    "position": "Defender",
  },
  {
    "name": "Andrew Robertson",
    "position": "Defender",
  },
  {
    "name": "Fabinho",
    "position": "Midfielder",
  },
  {
    "name": "Jordan Henderson",
    "position": "Midfielder",
  },
  {
    "name": "Harvey Elliot",
    "position": "Midfielder",
  },
  {
    "name": "Mohamed Salah",
    "position": "Forward",
  },
  {
    "name": "Cody Gakpo",
    "position": "Forward",
  },
  {
    "name": "Roberto Firmino",
    "position": "Forward",
  },
];

// get rid of old records
await deleteAllRecords();

const kv = await Deno.openKv();

// insert players from JSON
for (const player of players) {
  const id = crypto.randomUUID();
  player.id = id;
  const results = await kv.atomic()
    .check({ key: ["players", id], versionstamp: null })
    .check({
      key: ["players_by_position", player.position, player.id],
      versionstamp: null,
    })
    .set(["players", id], player)
    .set(["players_by_position", player.position, player.id], player)
    .commit();
  if (results.ok === false) {
    throw new Error(`Problem loading player ${player.name}`);
  }
}

const findPlayersByPosition = async (position: Position) => {
  const iter = kv.list<Player>({ prefix: ["players_by_position", position] });

  for await (const player of iter) {
    const playerPosition = await kv.get<Player>([
      "players_by_position",
      player.value.position,
      player.value.id ?? "",
    ]);
    console.log(playerPosition.value?.name);
  }
};

// search for various positions
await findPlayersByPosition("Forward");
await findPlayersByPosition("Midfielder");
await findPlayersByPosition("Defender");
