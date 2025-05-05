export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to ReviewBoost-AI
        </h1>
        <p className="text-center text-lg mb-8">
          Collect and analyze customer reviews with AI
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Smart Review Collection</h2>
            <p>Automatically request reviews after delivery and collect valuable feedback.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">AI-Powered Analysis</h2>
            <p>Get insights on sentiment, keywords, and trends from customer reviews.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Beautiful Display</h2>
            <p>Showcase your reviews with customizable widgets on your store.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 