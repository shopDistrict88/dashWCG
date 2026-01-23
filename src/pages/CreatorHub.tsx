import { useState } from 'react'
import styles from './CreatorHub.module.css'

interface PlatformStats {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x'
  connected: boolean
  followers: number
  engagement: number
  posts: number
  views: number
  growth: number
}

interface Post {
  id: string
  platform: string
  thumbnail: string
  caption: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  date: string
}

export function CreatorHub() {
  const [platforms, setPlatforms] = useState<PlatformStats[]>([
    { platform: 'instagram', connected: false, followers: 0, engagement: 0, posts: 0, views: 0, growth: 0 },
    { platform: 'tiktok', connected: false, followers: 0, engagement: 0, posts: 0, views: 0, growth: 0 },
    { platform: 'youtube', connected: false, followers: 0, engagement: 0, posts: 0, views: 0, growth: 0 },
    { platform: 'x', connected: false, followers: 0, engagement: 0, posts: 0, views: 0, growth: 0 },
  ])

  const [topPosts, setTopPosts] = useState<Post[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const handleConnect = (platform: string) => {
    // Mock connection - in production, this would trigger OAuth
    console.log(`Connecting to ${platform}...`)
    setPlatforms(prev =>
      prev.map(p =>
        p.platform === platform
          ? {
              ...p,
              connected: true,
              followers: Math.floor(Math.random() * 50000) + 1000,
              engagement: Math.random() * 10 + 2,
              posts: Math.floor(Math.random() * 200) + 10,
              views: Math.floor(Math.random() * 1000000) + 10000,
              growth: Math.random() * 20 - 5,
            }
          : p
      )
    )
    
    // Generate mock top posts
    const mockPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${platform}-${i}`,
      platform,
      thumbnail: `https://via.placeholder.com/300x300/111/fff?text=${platform.toUpperCase()}`,
      caption: `Sample post ${i + 1} from ${platform}`,
      views: Math.floor(Math.random() * 100000) + 1000,
      likes: Math.floor(Math.random() * 10000) + 100,
      comments: Math.floor(Math.random() * 1000) + 10,
      shares: Math.floor(Math.random() * 500) + 5,
      engagement: Math.random() * 15 + 2,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    
    setTopPosts(prev => [...prev, ...mockPosts])
  }

  const totalFollowers = platforms.reduce((sum, p) => sum + (p.connected ? p.followers : 0), 0)
  const avgEngagement = platforms.filter(p => p.connected).reduce((sum, p) => sum + p.engagement, 0) / platforms.filter(p => p.connected).length || 0
  const totalPosts = platforms.reduce((sum, p) => sum + (p.connected ? p.posts : 0), 0)
  const totalViews = platforms.reduce((sum, p) => sum + (p.connected ? p.views : 0), 0)

  const filteredPosts = selectedPlatform === 'all' 
    ? topPosts 
    : topPosts.filter(p => p.platform === selectedPlatform)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Creator Hub</h1>
        <p className={styles.subtitle}>Social media analytics and insights</p>
      </header>

      {/* Platform Connections */}
      <section className={styles.platformsSection}>
        <h2>Connected Platforms</h2>
        <div className={styles.platformsGrid}>
          {platforms.map(platform => (
            <div key={platform.platform} className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <h3>{platform.platform.toUpperCase()}</h3>
                {platform.connected ? (
                  <span className={styles.connectedBadge}>Connected</span>
                ) : (
                  <button
                    className={styles.connectBtn}
                    onClick={() => handleConnect(platform.platform)}
                  >
                    Connect
                  </button>
                )}
              </div>
              {platform.connected && (
                <div className={styles.platformStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Followers</span>
                    <span className={styles.statValue}>{platform.followers.toLocaleString()}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Engagement</span>
                    <span className={styles.statValue}>{platform.engagement.toFixed(1)}%</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Growth</span>
                    <span className={`${styles.statValue} ${platform.growth >= 0 ? styles.positive : styles.negative}`}>
                      {platform.growth >= 0 ? '+' : ''}{platform.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Overview Stats */}
      {platforms.some(p => p.connected) && (
        <>
          <section className={styles.overviewSection}>
            <h2>Overview</h2>
            <div className={styles.timeRangeSelector}>
              <button
                className={timeRange === '7d' ? styles.active : ''}
                onClick={() => setTimeRange('7d')}
              >
                Last 7 days
              </button>
              <button
                className={timeRange === '30d' ? styles.active : ''}
                onClick={() => setTimeRange('30d')}
              >
                Last 30 days
              </button>
              <button
                className={timeRange === '90d' ? styles.active : ''}
                onClick={() => setTimeRange('90d')}
              >
                Last 90 days
              </button>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statCardLabel}>Total Followers</span>
                <span className={styles.statCardValue}>{totalFollowers.toLocaleString()}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statCardLabel}>Avg Engagement</span>
                <span className={styles.statCardValue}>{avgEngagement.toFixed(1)}%</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statCardLabel}>Total Posts</span>
                <span className={styles.statCardValue}>{totalPosts}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statCardLabel}>Total Views</span>
                <span className={styles.statCardValue}>{(totalViews / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </section>

          {/* Top Performing Posts */}
          <section className={styles.postsSection}>
            <div className={styles.postsHeader}>
              <h2>Top Performing Content</h2>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className={styles.platformFilter}
              >
                <option value="all">All Platforms</option>
                {platforms.filter(p => p.connected).map(p => (
                  <option key={p.platform} value={p.platform}>{p.platform.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className={styles.postsGrid}>
              {filteredPosts.slice(0, 6).map(post => (
                <div key={post.id} className={styles.postCard}>
                  <div className={styles.postThumbnail}>
                    <img src={post.thumbnail} alt="" />
                    <span className={styles.platformBadge}>{post.platform}</span>
                  </div>
                  <div className={styles.postContent}>
                    <p className={styles.postCaption}>{post.caption}</p>
                    <div className={styles.postMetrics}>
                      <span>{(post.views / 1000).toFixed(0)}K views</span>
                      <span>{(post.likes / 1000).toFixed(1)}K likes</span>
                      <span>{post.engagement.toFixed(1)}% eng.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights */}
          <section className={styles.insightsSection}>
            <h2>AI Insights</h2>
            <div className={styles.insightsGrid}>
              <div className={styles.insightCard}>
                <h3>Best Posting Time</h3>
                <p>Tuesday and Thursday, 6-8 PM</p>
                <span className={styles.insightDetail}>Based on your audience activity</span>
              </div>
              <div className={styles.insightCard}>
                <h3>Content Recommendation</h3>
                <p>Behind-the-scenes content performs 34% better</p>
                <span className={styles.insightDetail}>Try more authentic, unpolished posts</span>
              </div>
              <div className={styles.insightCard}>
                <h3>Audience Insight</h3>
                <p>18-24 age group growing fastest</p>
                <span className={styles.insightDetail}>+23% in last 30 days</span>
              </div>
              <div className={styles.insightCard}>
                <h3>Consistency Score</h3>
                <p>72/100</p>
                <span className={styles.insightDetail}>Post 2 more times weekly to reach 85</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
