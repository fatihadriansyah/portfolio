// Counter Animation Helper
function animateCounter(element, target) {
    let current = 0;
    const duration = 1500; // ms
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
        current += 1;
        element.textContent = current;
        if (current >= target) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Skill Bar Animation Observer
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItem = entry.target;
            const percent = skillItem.getAttribute('data-percent');
            const bar = skillItem.querySelector('.skill-progress');
            const counter = skillItem.querySelector('.counter');
            
            // Trigger Width Animation
            bar.style.width = percent + '%';
            
            // Trigger Counter Animation if not done yet
            if (counter.textContent === '0') {
                 animateCounter(counter, parseInt(percent));
            }
            
            skillObserver.unobserve(skillItem); // Only animate once
        }
    });
}, { threshold: 0.5 });

// General Section Reveal Observer
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// Observe Skill Items
document.addEventListener('DOMContentLoaded', () => {
     const skills = document.querySelectorAll('.skill-item');
     skills.forEach(skill => skillObserver.observe(skill));
     
     // INITIALIZE LOAD MORE FUNCTIONALITY
     setupLoadMore('content-org', 'btn-load-org', 3); // Max 3 items for Org
     setupLoadMore('content-vol', 'btn-load-vol', 3); // Max 3 items for Vol
});


const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

function switchTab(type) {
    const contentOrg = document.getElementById('content-org');
    const contentVol = document.getElementById('content-vol');
    const btnOrg = document.getElementById('btn-org');
    const btnVol = document.getElementById('btn-vol');

    if (type === 'org') {
        contentOrg.classList.remove('hidden');
        contentVol.classList.add('hidden');
        btnOrg.classList.add('tab-active');
        btnOrg.classList.remove('tab-inactive');
        btnVol.classList.remove('tab-active');
        btnVol.classList.add('tab-inactive');
    } else {
        contentVol.classList.remove('hidden');
        contentOrg.classList.add('hidden');
        btnVol.classList.add('tab-active');
        btnVol.classList.remove('tab-inactive');
        btnOrg.classList.remove('tab-active');
        btnOrg.classList.add('tab-inactive');
    }
}

// --- NEW FUNCTION: LOAD MORE LOGIC ---
function setupLoadMore(containerId, buttonId, limit) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    
    // Get all direct children divs (experience items)
    // We filter only divs to avoid counting the button wrapper itself if it's inside
    const items = Array.from(container.children).filter(child => child.tagName === 'DIV' && !child.classList.contains('text-center'));
    
    // 1. Check if we need the button at all
    if (items.length <= limit) {
        if (button) button.parentElement.style.display = 'none'; // Hide the button container
        return;
    }

    // 2. Hide items above the limit initially
    items.forEach((item, index) => {
        if (index >= limit) {
            item.classList.add('hidden');
        }
    });

    // 3. Add Click Event
    if (button) {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('data-expanded') === 'true';
            
            if (isExpanded) {
                // COLLAPSE: Hide items again
                items.forEach((item, index) => {
                    if (index >= limit) {
                        item.classList.add('hidden');
                    }
                });
                button.textContent = 'Load More';
                button.setAttribute('data-expanded', 'false');
                
                // Optional: Scroll back to top of container smoothly so user doesn't lose context
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // EXPAND: Show all items
                items.forEach(item => {
                    item.classList.remove('hidden');
                    // Add small animation
                    item.classList.add('fade-in'); 
                });
                button.textContent = 'Show Less';
                button.setAttribute('data-expanded', 'true');
            }
        });
    }
}