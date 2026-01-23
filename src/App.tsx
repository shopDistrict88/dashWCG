import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/Toast'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { Home } from './pages/Home'
import { AI } from './pages/AI'
import { Creators } from './pages/Creators'
import BrandBuilder from './pages/BrandBuilder'
import { ContentStudio } from './pages/ContentStudio'
import { Projects } from './pages/Projects'
import { LaunchLab } from './pages/LaunchLab'
import { Commerce } from './pages/Commerce'
import { Funding } from './pages/Funding'
import { Business } from './pages/Business'
import { Growth } from './pages/Growth'
import { PersonalBrand } from './pages/PersonalBrand'
import { Education } from './pages/Education'
import { Community } from './pages/Community'
import { Marketplace } from './pages/Marketplace'
import { Ideas } from './pages/Ideas'
import CreativeHealth from './pages/CreativeHealth'
import CollaborationHub from './pages/CollaborationHub'
import MediaVault from './pages/MediaVault'
import InsightsLab from './pages/InsightsLab'
import LegacyOwnership from './pages/LegacyOwnership'
import { SocialMedia } from './pages/SocialMedia'
import { MusicStudio } from './pages/MusicStudio'
import { Settings } from './pages/Settings'
import { Fashion } from './pages/Fashion'
import { FitWearTesting } from './pages/FitWearTesting'
import { ProductIdeationLab } from './pages/ProductIdeationLab'
import { 
  PrototypeVault, 
  ProblemSolutionMapper, 
  MarketSignalsBoard, 
  PricingPsychologyLab,
  PackagingDesignStudio,
  WorldbuildingStudio,
  StoryIPVault,
  EditorialStudio,
  VisualCampaignBuilder,
  CulturalTimingIndex,
  RDPlayground,
  SpeculativeConcepts,
  CreativeConstraintsEngine,
  CrossDisciplineFusionLab,
  IPRegistry,
  ArchiveProvenance,
  CreativeEstateMode
} from './pages/AdditionalPages'
import { CreativeIntelligence, QuietWins, IdeaManagement } from './pages/CreativeIntelligence'
import { Notes } from './pages/Notes'
import { CreativeDecisions, StrategyTools } from './pages/CreativeDecisions'
import { BrandIdentity, CulturalRisk } from './pages/BrandSystems'
import { ProductIntelligence, QualityEthics } from './pages/ProductIntelligence'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard/*"
          element={<DashboardPage />}
        >
          <Route index element={<Home />} />
          <Route path="ai" element={<AI />} />
          <Route path="music-studio" element={<MusicStudio />} />
          <Route path="social-media" element={<SocialMedia />} />
          <Route path="creators" element={<Creators />} />
          <Route path="brand-builder" element={<BrandBuilder />} />
          <Route path="content-studio" element={<ContentStudio />} />
          <Route path="projects" element={<Projects />} />
          <Route path="launch-lab" element={<LaunchLab />} />
          <Route path="fashion" element={<Fashion />} />
          <Route path="fit-wear-testing" element={<FitWearTesting />} />
          <Route path="product-ideation-lab" element={<ProductIdeationLab />} />
          <Route path="commerce" element={<Commerce />} />
          <Route path="funding" element={<Funding />} />
          <Route path="business" element={<Business />} />
          <Route path="growth" element={<Growth />} />
          <Route path="personal-brand" element={<PersonalBrand />} />
          <Route path="education" element={<Education />} />
          <Route path="community" element={<Community />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="creative-health" element={<CreativeHealth />} />
          <Route path="collaboration-hub" element={<CollaborationHub />} />
          <Route path="media-vault" element={<MediaVault />} />
          <Route path="insights-lab" element={<InsightsLab />} />
          <Route path="legacy-ownership" element={<LegacyOwnership />} />
          <Route path="prototype-vault" element={<PrototypeVault />} />
          <Route path="problem-solution-mapper" element={<ProblemSolutionMapper />} />
          <Route path="market-signals-board" element={<MarketSignalsBoard />} />
          <Route path="pricing-psychology-lab" element={<PricingPsychologyLab />} />
          <Route path="packaging-design-studio" element={<PackagingDesignStudio />} />
          <Route path="worldbuilding-studio" element={<WorldbuildingStudio />} />
          <Route path="story-ip-vault" element={<StoryIPVault />} />
          <Route path="editorial-studio" element={<EditorialStudio />} />
          <Route path="visual-campaign-builder" element={<VisualCampaignBuilder />} />
          <Route path="cultural-timing-index" element={<CulturalTimingIndex />} />
          <Route path="rd-playground" element={<RDPlayground />} />
          <Route path="speculative-concepts" element={<SpeculativeConcepts />} />
          <Route path="creative-constraints-engine" element={<CreativeConstraintsEngine />} />
          <Route path="cross-discipline-fusion-lab" element={<CrossDisciplineFusionLab />} />
          <Route path="ip-registry" element={<IPRegistry />} />
          <Route path="archive-provenance" element={<ArchiveProvenance />} />
          <Route path="creative-estate-mode" element={<CreativeEstateMode />} />
          <Route path="notes" element={<Notes />} />
          <Route path="creative-intelligence" element={<CreativeIntelligence />} />
          <Route path="quiet-wins" element={<QuietWins />} />
          <Route path="idea-management" element={<IdeaManagement />} />
          <Route path="creative-decisions" element={<CreativeDecisions />} />
          <Route path="strategy-tools" element={<StrategyTools />} />
          <Route path="brand-identity" element={<BrandIdentity />} />
          <Route path="cultural-risk" element={<CulturalRisk />} />
          <Route path="product-intelligence" element={<ProductIntelligence />} />
          <Route path="quality-ethics" element={<QualityEthics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

