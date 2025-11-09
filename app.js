// Sample data
const meetings = [
    {
        id: 1,
        title: "Mathematics - Calculus",
        date: "2024-11-07",
        time: "10:00 AM",
        duration: "1h 30m",
        status: "completed",
        url: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: 2,
        title: "Physics - Quantum Mechanics",
        date: "2024-11-07",
        time: "2:00 PM",
        duration: "1h 15m",
        status: "completed",
        url: "https://meet.google.com/xyz-abcd-efg"
    },
    {
        id: 3,
        title: "Computer Science - Algorithms",
        date: "2024-11-08",
        time: "11:00 AM",
        duration: "2h",
        status: "scheduled",
        url: "https://meet.google.com/lmn-opqr-stu"
    },
    {
        id: 4,
        title: "Chemistry - Organic Chemistry",
        date: "2024-11-08",
        time: "3:00 PM",
        duration: "1h 45m",
        status: "scheduled",
        url: "https://meet.google.com/uvw-xyz-abc"
    }
];

const notes = [
    {
        id: 1,
        meetingId: 1,
        title: "Mathematics - Calculus",
        preview: "Key topics: Derivatives, Integration by parts, Chain rule applications...",
        date: "2024-11-07",
        keyPoints: 5
    },
    {
        id: 2,
        meetingId: 2,
        title: "Physics - Quantum Mechanics",
        preview: "Discussed wave-particle duality, Schrödinger equation, quantum states...",
        date: "2024-11-07",
        keyPoints: 7
    }
];

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update active page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
        
        // Update page title
        document.getElementById('page-title').textContent = 
            item.textContent.trim().replace(/^[^\w]+/, '');
        
        // Load page content
        loadPageContent(page);
    });
});

// Load page content
function loadPageContent(page) {
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'meetings':
            loadMeetings();
            break;
        case 'notes':
            loadNotes();
            break;
        case 'schedule':
            loadSchedule();
            break;
    }
}

// Load dashboard
function loadDashboard() {
    const recentMeetings = document.getElementById('recent-meetings');
    recentMeetings.innerHTML = meetings.slice(0, 3).map(meeting => createMeetingCard(meeting)).join('');
}

// Load all meetings
function loadMeetings() {
    const allMeetings = document.getElementById('all-meetings');
    allMeetings.innerHTML = meetings.map(meeting => createMeetingCard(meeting)).join('');
}

// Create meeting card HTML
function createMeetingCard(meeting) {
    const statusClass = `status-${meeting.status}`;
    const statusText = meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1);
    
    return `
        <div class="meeting-card">
            <div class="meeting-info">
                <h3>${meeting.title}</h3>
                <div class="meeting-meta">
                    <span>📅 ${meeting.date}</span>
                    <span>🕐 ${meeting.time}</span>
                    <span>⏱️ ${meeting.duration}</span>
                </div>
            </div>
            <div class="meeting-actions">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${meeting.status === 'completed' ? 
                    '<button class="btn btn-small btn-primary" onclick="viewNotes(' + meeting.id + ')">View Notes</button>' :
                    '<button class="btn btn-small btn-secondary">Join</button>'
                }
            </div>
        </div>
    `;
}

// Load notes
function loadNotes() {
    const notesGrid = document.getElementById('notes-grid');
    notesGrid.innerHTML = notes.map(note => `
        <div class="note-card" onclick="viewNoteDetail(${note.id})">
            <h3>${note.title}</h3>
            <p class="note-preview">${note.preview}</p>
            <div class="note-footer">
                <span>${note.date}</span>
                <span>${note.keyPoints} key points</span>
            </div>
        </div>
    `).join('');
}

// Load schedule
function loadSchedule() {
    const scheduleList = document.getElementById('schedule-list');
    const scheduled = meetings.filter(m => m.status === 'scheduled');
    scheduleList.innerHTML = scheduled.map(meeting => createMeetingCard(meeting)).join('');
}

// Modal handling
const modal = document.getElementById('add-meeting-modal');
const addMeetingBtn = document.getElementById('add-meeting-btn');
const scheduleBtn = document.getElementById('schedule-meeting-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');

if (addMeetingBtn) {
    addMeetingBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Save meeting
document.getElementById('save-meeting-btn').addEventListener('click', () => {
    const title = document.getElementById('meeting-title').value;
    const url = document.getElementById('meeting-url').value;
    const time = document.getElementById('meeting-time').value;
    
    if (title && url && time) {
        // In real app, this would make an API call
        alert('Meeting scheduled successfully!');
        modal.classList.remove('active');
        
        // Clear form
        document.getElementById('meeting-title').value = '';
        document.getElementById('meeting-url').value = '';
        document.getElementById('meeting-time').value = '';
    } else {
        alert('Please fill in all fields');
    }
});

// View notes function
function viewNotes(meetingId) {
    const note = notes.find(n => n.meetingId === meetingId);
    if (note) {
        alert(`Viewing notes for: ${note.title}\n\n${note.preview}\n\nIn a real app, this would open a detailed notes view.`);
    }
}

// View note detail
function viewNoteDetail(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        alert(`${note.title}\n\n${note.preview}\n\nIn a real app, this would show the full notes with key points, timestamps, and more.`);
    }
}

// Initialize dashboard on load
loadDashboard();
