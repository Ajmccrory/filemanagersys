document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const addPersonModal = document.getElementById('addPersonModal');
    const addOrgModal = document.getElementById('addOrgModal');
    const factsModal = document.getElementById('factsModal');
    const tagModal = document.getElementById('tagModal');

    // Modal control functions
    window.showAddPersonModal = function() {
        addPersonModal.style.display = 'block';
    }

    window.showAddOrgModal = function() {
        addOrgModal.style.display = 'block';
    }

    window.showFactsModal = function(entityId, type) {
        factsModal.style.display = 'block';
        loadFacts(entityId, type);
    }

    window.showTagModal = function(entityId, type) {
        tagModal.style.display = 'block';
        loadTags(entityId, type);
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

    // Facts management
    async function loadFacts(entityId, type) {
        const response = await fetch(`/${type}/${entityId}/facts`);
        const data = await response.json();
        const factsContainer = document.getElementById('factsContainer');
        
        factsContainer.innerHTML = data.facts.map(fact => `
            <div class="fact-item">
                <p>${fact.content}</p>
                <button onclick="deleteFact(${fact.id}, '${type}')">Delete</button>
            </div>
        `).join('');

        // Update form action
        const factForm = document.getElementById('addFactForm');
        factForm.action = `/${type}/${entityId}/facts`;
    }

    // Tags management
    async function loadTags(entityId, type) {
        const response = await fetch(`/${type}/${entityId}/tags`);
        const data = await response.json();
        const tagsContainer = document.getElementById('tagsContainer');
        
        tagsContainer.innerHTML = data.tags.map(tag => `
            <div class="tag-item">
                <span>${tag.name}</span>
                <button onclick="removeTag(${entityId}, ${tag.id}, '${type}')">×</button>
            </div>
        `).join('');
    }

    // Filter functionality
    window.updateFilter = function(value) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('filter', value);
        window.location.href = currentUrl.toString();
    }

    // Add fact submission handler
    document.getElementById('addFactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        await fetch(this.action, {
            method: 'POST',
            body: formData
        });
        loadFacts(this.dataset.entityId, this.dataset.entityType);
        this.reset();
    });
});

// Delete fact function
async function deleteFact(factId, type) {
    if (confirm('Are you sure you want to delete this fact?')) {
        await fetch(`/${type}/fact/${factId}`, {
            method: 'DELETE'
        });
        const entityId = document.getElementById('addFactForm').dataset.entityId;
        loadFacts(entityId, type);
    }
}

// Tag management functions
async function addTag(entityId, type) {
    const tagInput = document.getElementById('newTagInput');
    const response = await fetch(`/${type}/${entityId}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tag: tagInput.value })
    });
    tagInput.value = '';
    loadTags(entityId, type);
}

async function removeTag(entityId, tagId, type) {
    if (confirm('Remove this tag?')) {
        await fetch(`/${type}/${entityId}/tags/${tagId}`, {
            method: 'DELETE'
        });
        loadTags(entityId, type);
    }
} 