document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('caseModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // Open modal when clicking case title
    document.querySelectorAll('.case-title').forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();
            const caseCard = this.closest('.case-card');
            const caseId = caseCard.dataset.caseId;
            
            fetch(`/case/${caseId}`)
                .then(response => response.text())
                .then(html => {
                    document.getElementById('caseDetails').innerHTML = html;
                    modal.style.display = 'block';
                });
        });
    });
    
    // Close modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Edit case functionality
    document.querySelectorAll('.edit-case').forEach(button => {
        button.addEventListener('click', function() {
            const caseCard = this.closest('.case-card');
            const caseId = caseCard.dataset.caseId;
            const title = caseCard.querySelector('h3 a').textContent;
            const description = caseCard.querySelector('p').textContent;
            
            caseCard.innerHTML = `
                <form action="/case/${caseId}/edit" method="POST" enctype="multipart/form-data">
                    <input type="text" name="title" value="${title}" required>
                    <textarea name="description">${description}</textarea>
                    <input type="file" name="file" accept=".pdf,.doc,.docx,.txt">
                    <button type="submit">Save</button>
                    <button type="button" class="cancel-edit">Cancel</button>
                </form>
            `;
        });
    });
    
    // Cancel edit functionality
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('cancel-edit')) {
            location.reload();
        }
    });
    
    // Menu functionality - moved outside of modal checks
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.querySelector('.close-menu');
    const casesList = document.getElementById('casesList');
    const casesSubmenu = document.getElementById('casesSubmenu');
    
    if (menuToggle && sideMenu && closeMenu) {  // Add safety checks
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });
        
        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                sideMenu.classList.remove('active');
            }
        });
    }
    
    // Toggle cases submenu
    if (casesList && casesSubmenu) {  // Add safety check
        casesList.addEventListener('click', (e) => {
            e.preventDefault();
            casesSubmenu.classList.toggle('active');
        });
    }

    // Create case modal functionality
    const createCaseLink = document.getElementById('createCase');
    
    if (createCaseLink && modal) {
        createCaseLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }
});
