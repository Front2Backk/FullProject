import sys
import asyncio
import threading
from livekit import agents
from livekit.agents import Agent, AgentSession, RoomInputOptions
from Config.config import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from livekit.plugins import google, noise_cancellation
from Tools.agent_tools import DuckDuckGoSearchTool
from dotenv import load_dotenv
import os
load_dotenv()

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTION)

class LiveKitChatAgent:
    def __init__(self, voice="Charon", enable_search=True):
        self.voice = voice
        self.session = None
        self.ctx = None
        self.search_tool = DuckDuckGoSearchTool() if enable_search else None
        self._running = False  # Flag to control thread execution

    async def setup_session(self):
        llm = google.beta.realtime.RealtimeModel(voice=self.voice)

        if self.search_tool:
            if hasattr(llm, 'add_tool'):
                llm.add_tool(self.search_tool)
            elif hasattr(llm, 'add_function'):
                llm.add_function(
                    name=self.search_tool.name,
                    description=self.search_tool.description,
                    callback=self.search_tool.execute
                )

        self.session = AgentSession(llm=llm)
        await self.session.start(
            room=self.ctx.room,
            agent=Assistant(),
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC()
            ),
        )
        await self.ctx.connect()

    async def start_chat(self):
        self._running = True
        if self.session is None:
            await self.setup_session()
            await self.session.generate_reply(instructions=SESSION_INSTRUCTION)
        else:
            print("Session already running.")

    async def end_chat(self):
        self._running = False
        if self.session:
            await self.session.end()
            self.session = None
        else:
            print("No session to end.")

    @staticmethod
    async def entrypoint(ctx: agents.JobContext):
        agent = LiveKitChatAgent()
        agent.ctx = ctx
        await agent.start_chat()
        while agent._running:
            await asyncio.sleep(1)

def run_livekit_worker():
    sys.argv = ["AgentStarter.py", "console"]
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=LiveKitChatAgent.entrypoint)
    )
