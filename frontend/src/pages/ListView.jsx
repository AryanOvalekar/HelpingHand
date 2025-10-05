import React from 'react'
import EventList from '../components/EventList'
import './ListView.css'

const ListView = () => {
  // Hardcoded test data
  const events = [
    {
      id: 1,
      title: "Hurricane Relief Effort - Miami",
      description: "Urgent assistance needed for hurricane victims in Miami area. Volunteers and supplies desperately needed.",
      time: "2 hours ago",
      severity: true,
      location: "Miami, FL",
      needsClothes: 3,
      needsFood: 2,
      needsManpower: 3,
      needsFunding: 2,
      articleLink: "https://example.com/hurricane-relief",
      imageLink: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
      type: 0 // Disaster
    },
    {
      id: 2,
      title: "Community Food Drive",
      description: "Local food bank organizing drive to help families in need during the holiday season.",
      time: "5 hours ago",
      severity: false,
      location: "Austin, TX",
      needsClothes: 1,
      needsFood: 3,
      needsManpower: 2,
      needsFunding: 1,
      articleLink: "https://example.com/food-drive",
      imageLink: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
      type: 2 // Volunteering
    },
    {
      id: 3,
      title: "Wildfire Emergency Response",
      description: "Immediate evacuation assistance needed for wildfire affected areas in Northern California.",
      time: "1 day ago",
      severity: true,
      location: "Sacramento, CA",
      needsClothes: 2,
      needsFood: 3,
      needsManpower: 3,
      needsFunding: 3,
      articleLink: "https://example.com/wildfire-response",
      imageLink: "https://images.unsplash.com/photo-1574951952988-3c5d2d90b0a0?w=400",
      type: 0 // Disaster
    },
    {
      id: 4,
      title: "Homeless Shelter Support",
      description: "Winter shelter program seeking volunteers and donations to help homeless individuals stay warm.",
      time: "3 days ago",
      severity: false,
      location: "Seattle, WA",
      needsClothes: 3,
      needsFood: 2,
      needsManpower: 2,
      needsFunding: 2,
      articleLink: "https://example.com/shelter-support",
      imageLink: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
      type: 1 // Relief
    },
    {
      id: 5,
      title: "School Supply Collection",
      description: "Back-to-school supply drive for underprivileged children in local elementary schools.",
      time: "1 week ago",
      severity: false,
      location: "Denver, CO",
      needsClothes: 0,
      needsFood: 0,
      needsManpower: 1,
      needsFunding: 2,
      articleLink: "https://example.com/school-supplies",
      imageLink: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      type: 2 // Volunteering
    },
    {
      id: 6,
      title: "Flood Damage Recovery - Louisiana",
      description: "Massive flooding has displaced hundreds of families. Emergency shelter and cleanup volunteers urgently needed.",
      time: "4 hours ago",
      severity: true,
      location: "Baton Rouge, LA",
      needsClothes: 3,
      needsFood: 3,
      needsManpower: 3,
      needsFunding: 3,
      articleLink: "https://example.com/flood-recovery",
      imageLink: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
      type: 0 // Disaster
    },
    {
      id: 7,
      title: "Senior Citizen Meal Delivery",
      description: "Weekly meal delivery program for homebound seniors needs volunteer drivers and meal preparers.",
      time: "12 hours ago",
      severity: false,
      location: "Portland, OR",
      needsClothes: 0,
      needsFood: 2,
      needsManpower: 2,
      needsFunding: 1,
      articleLink: "https://example.com/senior-meals",
      imageLink: "https://images.unsplash.com/photo-1559071139-5cf7f1b07b72?w=400",
      type: 2 // Volunteering
    },
    {
      id: 8,
      title: "Tornado Relief Operations",
      description: "Devastating tornado touched down destroying homes and businesses. Search and rescue operations ongoing.",
      time: "6 hours ago",
      severity: true,
      location: "Oklahoma City, OK",
      needsClothes: 2,
      needsFood: 2,
      needsManpower: 3,
      needsFunding: 3,
      articleLink: "https://example.com/tornado-relief",
      imageLink: "https://images.unsplash.com/photo-1502040097101-81ed8b494ade?w=400",
      type: 0 // Disaster
    },
    {
      id: 9,
      title: "Children's Hospital Support",
      description: "Local children's hospital organizing toy drive and volunteer reading program for young patients.",
      time: "2 days ago",
      severity: false,
      location: "Boston, MA",
      needsClothes: 0,
      needsFood: 0,
      needsManpower: 1,
      needsFunding: 2,
      articleLink: "https://example.com/hospital-support",
      imageLink: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
      type: 1 // Relief
    },
    {
      id: 10,
      title: "Community Garden Project",
      description: "Neighborhood initiative to create community garden providing fresh produce for local food pantries.",
      time: "5 days ago",
      severity: false,
      location: "Minneapolis, MN",
      needsClothes: 0,
      needsFood: 1,
      needsManpower: 3,
      needsFunding: 1,
      articleLink: "https://example.com/community-garden",
      imageLink: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      type: 2 // Volunteering
    }
  ];

  return (
    <div className="listview">
      <div className="listview-content">
        <EventList events={events} />
      </div>
    </div>
  )
}

export default ListView