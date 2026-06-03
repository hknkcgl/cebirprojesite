document.addEventListener('DOMContentLoaded', function() {
    // Handle the loading screen animation
    const loadingScreen = document.getElementById('loading-screen');
    const mainPage = document.getElementById('main-page');
    
    // Wait for the logo animation to complete
    setTimeout(function() {
        // Fade out the loading screen
        loadingScreen.style.opacity = '0';
        
        // After fade out, hide the loading screen and show main content
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            mainPage.style.display = 'block';
        }, 500); // Match the transition time
    }, 2000); // 2 seconds to match the animation duration
    
    // Function to handle "Add Contact" button
    const addContactBtn = document.querySelector('.add-contact-btn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', function() {
            // Check if we're on mobile
            if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
                // On mobile, suggest downloading a vCard app or showing instructions
                alert('Lütfen kişiyi eklemek için bu sayfayı tarayıcınızda "Sayfayı Kaydet" veya "Ev Düğmesi" > "Ana Ekrana Ekle" seçeneğini kullanın.');
            } else {
                // On desktop, provide instructions
                alert('Mobil cihazınızda bu sayfayı ziyaret ederek "Paylaş" > "Kişilere Ekle" seçeneğini kullanabilirsiniz.');
            }
        });
    }
});