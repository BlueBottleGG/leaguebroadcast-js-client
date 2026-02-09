/**
 * Example usage of the League Broadcast Client Library
 *
 * This file demonstrates various ways to use the client library
 * in different scenarios.
 */

import { LeagueBroadcastClient, GameState, ingameFrontendData } from "../src";

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

function basicExample() {
  // Create a new client instance
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
    autoConnect: true,
  });

  // Listen for state updates
  client.onStateUpdate((gameData) => {
    console.log("Game Time:", gameData.gameTime);
    console.log("Blue Team Kills:", gameData.scoreboard?.teams[0]?.kills);
    console.log("Red Team Kills:", gameData.scoreboard?.teams[1]?.kills);
  });

  // Listen for game status changes
  client.onGameStatusChange((status, isTestingEnv) => {
    if (status === GameState.Running) {
      console.log("🎮 Game started!");
    } else if (status === GameState.Paused) {
      console.log("⏸️ Game paused");
    } else if (status === GameState.OutOfGame) {
      console.log("👋 Game ended!");
    }
  });
}

// ============================================================================
// Example 2: Event Handling
// ============================================================================

function eventHandlingExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Register handlers for all game events
  client.onGameEvents({
    onKillFeedEvent: (event) => {
      console.log(`💀 ${event.killer?.name} killed ${event.victim?.name}`);
    },

    onObjectiveEvent: (event) => {
      console.log(
        `🎯 Objective secured: ${event.objective} by team ${event.team}`,
      );
    },

    onFirstTowerEvent: (event) => {
      console.log(`🏰 First tower taken by team ${event}!`);
    },

    onAnnouncementEvent: (event) => {
      console.log(`📢 Announcement: ${event.type}`);
    },

    onPlayerEvent: (event) => {
      const eventData =
        event.boughtItems || event.levelUp || event.soldOrConsumedItems;
      console.log(`👤 Player event: ${eventData}`);
    },

    onTeamEvent: (event) => {
      const eventData =
        event.inhibitorsTaken || event.platesTaken || event.turretsTaken;
      console.log(`👥 Team event: ${eventData}`);
    },
  });
}

// ============================================================================
// Example 3: Manual Connection Control
// ============================================================================

async function manualConnectionExample() {
  const client = new LeagueBroadcastClient({
    host: "192.168.1.100",
    port: 58869,
    autoConnect: false, // Don't connect automatically
  });

  // Connect manually when ready
  try {
    console.log("Connecting to backend...");
    await client.connect();
    console.log("✅ Connected successfully!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return;
  }

  // Do something...

  // Disconnect when done
  client.disconnect();
  console.log("Disconnected from backend");
}

// ============================================================================
// Example 4: Using Cache URLs
// ============================================================================

function cacheUrlExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Get base cache URL
  const baseCacheUrl = client.getCacheUrl();
  console.log("Cache base URL:", baseCacheUrl);

  var unsubscribe: () => void;

  // Listen for game data updates to get asset URLs
  function onGameDataUpdate(gameData: ingameFrontendData) {
    unsubscribe();

    const bluePlayerOne = gameData.scoreboardBottom?.teams[0].players[0];
    const bluePlayerTabData = gameData.tabs?.["Order"].players[0];
    if (!bluePlayerOne) return;

    const championIcon = client.getCacheUrl(bluePlayerOne.champion?.tileImg);
    const itemIcon = client.getCacheUrl(bluePlayerOne.items?.[0]?.assetUrl);
    const spellIcon = client.getCacheUrl(
      bluePlayerTabData?.abilities?.[0]?.assets?.iconAsset,
    );

    console.log("Champion icon:", championIcon);
    console.log("Item icon:", itemIcon);
    console.log("Spell icon:", spellIcon);

    // Use in a web page
    const img = document.createElement("img");
    img.src = championIcon;
    img.alt = "Aatrox";
    document.body.appendChild(img);
  }

  unsubscribe = client.onStateUpdate(onGameDataUpdate);
}

// ============================================================================
// Example 5: Real-time Scoreboard Display
// ============================================================================

function scoreboardExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  client.onStateUpdate((gameData: ingameFrontendData) => {
    if (!gameData.scoreboard) return;

    const blueTeam = gameData.scoreboard.teams[0];
    const redTeam = gameData.scoreboard.teams[1];

    console.clear();
    console.log("═══════════════════════════════════════");
    console.log(`⏱️  Game Time: ${formatGameTime(gameData.gameTime)}`);
    console.log("═══════════════════════════════════════");
    console.log(
      `🔵 Blue Team: ${blueTeam.kills} kills | ${blueTeam.gold} gold`,
    );
    console.log(`🔴 Red Team:  ${redTeam.kills} kills | ${redTeam.gold} gold`);
    console.log("═══════════════════════════════════════");

    const bluePlayers = gameData.scoreboardBottom?.teams[0].players;
    const redPlayers = gameData.scoreboardBottom?.teams[1].players;
    // Display player stats
    console.log("🔵 Blue Team Players:");
    bluePlayers?.forEach((player, idx) => {
      console.log(
        `  ${idx + 1}. ${player.champion?.name}: ${player.kills}/${player.deaths}/${player.assists} (${player.gold}g)`,
      );
    });

    console.log("🔴 Red Team Players:");
    redPlayers?.forEach((player, idx) => {
      console.log(
        `  ${idx + 1}. ${player.champion?.name}: ${player.kills}/${player.deaths}/${player.assists} (${player.gold}g)`,
      );
    });
    console.log("═══════════════════════════════════════");
  });
}

function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================================
// Example 6: Connection State Management
// ============================================================================

function connectionStateExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Handle connection events
  client.onConnect(() => {
    console.log("✅ Connected to backend");
  });

  client.onDisconnect(() => {
    console.log("❌ Disconnected from backend");
    console.log("🔄 Attempting to reconnect...");
  });

  client.onError((error) => {
    console.error("⚠️ Connection error:", error);
  });

  // Check connection status periodically
  setInterval(() => {
    const status = client.isConnected() ? "🟢 Online" : "🔴 Offline";
    console.log(`Connection status: ${status}`);
  }, 5000);
}

// ============================================================================
// Example 7: Unsubscribing from Events
// ============================================================================

function unsubscribeExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // All event handlers return an unsubscribe function
  const unsubscribeState = client.onStateUpdate((gameData) => {
    console.log("State updated:", gameData.gameTime);
  });

  const unsubscribeStatus = client.onGameStatusChange((status) => {
    console.log("Status changed:", status);
  });

  // Unsubscribe after 30 seconds
  setTimeout(() => {
    unsubscribeState();
    unsubscribeStatus();
    console.log("Unsubscribed from events");
  }, 30000);
}

// ============================================================================
// Run examples 
// ============================================================================

// basicExample();
// eventHandlingExample();
// manualConnectionExample();
// cacheUrlExample();
// scoreboardExample();
// connectionStateExample();
// unsubscribeExample();
