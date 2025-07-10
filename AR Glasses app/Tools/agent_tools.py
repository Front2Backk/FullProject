# agent_tools.py
from duckduckgo_search import DDGS  # Updated import
import asyncio

class DuckDuckGoSearchTool:
    """DuckDuckGo search tool compatible with current package version"""
    
    def __init__(self, max_results: int = 3):
        self.max_results = max_results
        self.name = "duckduckgo_search"
        self.description = "Perform web searches using DuckDuckGo"
        
    async def execute(self, query: str) -> str:
        """Perform web search and return formatted results"""
        try:
            with DDGS() as ddgs:
                results = [r for r in ddgs.text(query, max_results=self.max_results)]
            
            if not results:
                return "No search results found."
                
            formatted = []
            for i, result in enumerate(results, 1):
                formatted.append(
                    f"{i}. {result['title']}\n"
                    f"   URL: {result['href']}\n"
                    f"   {result['body']}\n"
                )
            return "Search Results:\n" + "\n".join(formatted)
        except Exception as e:
            return f"Search failed: {str(e)}"