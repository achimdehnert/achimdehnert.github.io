// Custom JavaScript for Personal Website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });

    // Contact form submission (client-side validation)
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const messageInput = this.querySelector('textarea');

            if (nameInput.value.trim() === '' || 
                emailInput.value.trim() === '' || 
                messageInput.value.trim() === '') {
                alert('Please fill out all fields.');
                return;
            }

            // In a real-world scenario, you would send this data to a backend
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Handle podcast subscription
    const subscribeForm = document.querySelector('#subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.querySelector('#subscriberName').value;
            const email = document.querySelector('#subscriberEmail').value;
            const notifications = document.querySelector('#notificationPreference').checked;

            // In a real application, you would send this data to your backend
            console.log('Subscription details:', { name, email, notifications });

            // Show success message
            const modal = bootstrap.Modal.getInstance(document.querySelector('#subscribeModal'));
            modal.hide();

            // Create and show toast notification
            const toastHTML = `
                <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                    <div class="toast show" role="alert">
                        <div class="toast-header">
                            <strong class="me-auto">Subscription Successful</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body">
                            Thank you for subscribing to the podcast updates!
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', toastHTML);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                const toast = document.querySelector('.toast');
                if (toast) {
                    toast.remove();
                }
            }, 3000);

            // Reset form
            this.reset();
        });
    }

    // Blog post filtering
    const blogFilterButtons = document.querySelectorAll('.blog-filter button');
    const blogPosts = document.querySelectorAll('#blogPosts > div');

    blogFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            blogFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            blogPosts.forEach(post => {
                if (filter === 'all' || post.getAttribute('data-category') === filter) {
                    post.style.display = 'block';
                    // Add fade-in animation
                    post.style.opacity = '0';
                    setTimeout(() => {
                        post.style.opacity = '1';
                    }, 50);
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // Load more posts functionality (demo)
    const loadMoreBtn = document.querySelector('#loadMorePosts');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real application, this would load more posts from a backend
            // For demo, we'll just show a message
            this.innerHTML = 'Loading...';
            setTimeout(() => {
                this.innerHTML = 'No More Posts';
                this.disabled = true;
            }, 1000);
        });
    }

    // Initialize article modals
    const articleModals = document.querySelectorAll('.modal');
    articleModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            // In a real application, you might want to load the full article content here
            console.log('Loading article content...');
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Optional: Add subtle animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('#about, #experience, #projects');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Blog search functionality
    const blogSearch = document.querySelector('#blogSearch');
    if (blogSearch) {
        blogSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogPosts = document.querySelectorAll('#blogPosts .blog-card');
            
            blogPosts.forEach(post => {
                const title = post.querySelector('.card-title').textContent.toLowerCase();
                const content = post.querySelector('.card-text').textContent.toLowerCase();
                const parent = post.closest('[data-category]');
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    parent.style.display = 'block';
                    // Highlight search terms
                    highlightSearchTerm(post, searchTerm);
                } else {
                    parent.style.display = 'none';
                }
            });
        });
    }

    // Search term highlighting
    function highlightSearchTerm(element, term) {
        if (!term) {
            // Reset highlights
            element.querySelectorAll('.search-highlight').forEach(el => {
                el.outerHTML = el.textContent;
            });
            return;
        }

        const regex = new RegExp(`(${term})`, 'gi');
        const title = element.querySelector('.card-title');
        const content = element.querySelector('.card-text');

        [title, content].forEach(el => {
            if (!el.dataset.original) {
                el.dataset.original = el.textContent;
            }
            el.innerHTML = el.dataset.original.replace(regex, '<span class="search-highlight">$1</span>');
        });
    }

    // Social sharing functionality
    window.shareArticle = function(platform) {
        const article = {
            title: document.querySelector('.modal.show .modal-title').textContent,
            url: window.location.href
        };

        let shareUrl;
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    // Comments functionality
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const comment = textarea.value.trim();
            
            if (comment) {
                // Create new comment element
                const commentHTML = `
                    <div class="comment mb-3">
                        <div class="comment-header">
                            <strong>Guest User</strong>
                            <small class="text-muted">Just now</small>
                        </div>
                        <p>${comment}</p>
                        <div class="comment-actions">
                            <button class="btn btn-sm btn-link">Reply</button>
                            <button class="btn btn-sm btn-link">Like</button>
                        </div>
                    </div>
                `;
                
                const commentsList = this.closest('.comments-section').querySelector('.comments-list');
                commentsList.insertAdjacentHTML('afterbegin', commentHTML);
                
                // Clear textarea
                textarea.value = '';
                
                // Update comment count
                const countElement = this.closest('.comments-section').querySelector('h4');
                const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
                countElement.textContent = countElement.textContent.replace(/\d+/, currentCount + 1);
            }
        });
    });
});
