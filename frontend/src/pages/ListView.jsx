import React from 'react'
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
    }
  ];

  return (
    <div className="listview">
      <div className="listview-content">
        <div className="events-feed">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.imageLink} alt={event.title} />
              </div>
              <div className="event-content">
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListView