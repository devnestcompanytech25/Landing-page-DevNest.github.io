    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        if (body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3D Canvas Animation
    const canvas = document.getElementById('canvas3d');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle3D {
        constructor() {
            this.reset();
            this.z = Math.random() * 1500;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = 1500;
            this.vz = Math.random() * 3 + 2;
            const brightness = Math.random() * 100 + 155;
            this.color = {
                r: brightness,
                g: brightness,
                b: brightness
            };
        }

        update() {
            this.z -= this.vz;
            if (this.z <= 0) {
                this.reset();
            }
        }

        draw() {
            const scale = 1500 / this.z;
            const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            const size = (1 - this.z / 1500) * 3;
            const alpha = (1 - this.z / 1500) * 0.5;

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);

            if (body.classList.contains('light-mode')) {
                const darkBrightness = Math.random() * 50 + 50;
                ctx.fillStyle = `rgba(${darkBrightness}, ${darkBrightness}, ${darkBrightness}, ${alpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(${darkBrightness}, ${darkBrightness}, ${darkBrightness}, ${alpha * 0.5})`;
            } else {
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`;
            }
            ctx.fill();
        }
    }

    class Connection {
        constructor(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }

        draw() {
            const scale1 = 1500 / this.p1.z;
            const scale2 = 1500 / this.p2.z;
            const x1 = (this.p1.x - canvas.width / 2) * scale1 + canvas.width / 2;
            const y1 = (this.p1.y - canvas.height / 2) * scale1 + canvas.height / 2;
            const x2 = (this.p2.x - canvas.width / 2) * scale2 + canvas.width / 2;
            const y2 = (this.p2.y - canvas.height / 2) * scale2 + canvas.height / 2;

            const dist = Math.hypot(x2 - x1, y2 - y1);
            if (dist < 150) {
                const alpha = (1 - dist / 150) * 0.15;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                if (body.classList.contains('light-mode')) {
                    ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
                } else {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                }
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    const particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle3D());
    }

    let angleX = 0;
    let angleY = 0;
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / canvas.width - 0.5) * 2;
        mouseY = (e.clientY / canvas.height - 0.5) * 2;
    });

    function animate() {
        if (body.classList.contains('light-mode')) {
            ctx.fillStyle = 'rgba(240, 249, 255, 0.15)';
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        angleX += (mouseY * 0.05 - angleX) * 0.05;
        angleY += (mouseX * 0.05 - angleY) * 0.05;

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (Math.abs(particles[i].z - particles[j].z) < 200) {
                    const conn = new Connection(particles[i], particles[j]);
                    conn.draw();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .about-content, .service-card, .portfolio-item, .contact-form, .footer-content').forEach(el => {
        observer.observe(el);
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.2}s`;
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.15}s`;
    });

    // Contact Form - Basin.io (Sends directly to your email!)
    document.querySelector('.contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const subject = document.getElementById('userSubject').value;
        const message = document.getElementById('userMessage').value;

        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        // Using Basin.io - Sends to devnest.company.tech25@gmail.com
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', `DevNest Contact: ${subject}`);
        formData.append('message', `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 NEW MESSAGE FROM DEVNEST WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${name}
📧 Email: ${email}
📋 Subject: ${subject}

💬 MESSAGE:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Sent: ${new Date().toLocaleString('en-US', { 
    timeZone: 'Africa/Cairo',
    dateStyle: 'full',
    timeStyle: 'short'
})}
🌐 From: DevNest Contact Form
            `);

        try {
            // Basin endpoint configured for devnest.company.tech25@gmail.com
            const response = await fetch('https://usebasin.com/f/267ce6427de6', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';

            if (response.ok || response.status === 200) {
                // Success Animation
                const successMsg = document.createElement('div');
                successMsg.innerHTML = `
                        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    background: linear-gradient(135deg, #4ade80 0%, #3b82f6 100%); 
                                    padding: 3.5rem 4.5rem; border-radius: 35px; z-index: 10000;
                                    box-shadow: 0 35px 90px rgba(74, 222, 128, 0.7), 0 0 100px rgba(59, 130, 246, 0.4);
                                    text-align: center; color: white;
                                    animation: successPop 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                                    border: 3px solid rgba(255,255,255,0.3);">
                            
                            <div style="position: relative; display: inline-block; margin-bottom: 2rem;">
                                <div style="font-size: 7rem; line-height: 1; animation: checkSpin 0.8s ease;">
                                    ✓
                                </div>
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                            width: 140px; height: 140px; border-radius: 50%;
                                            border: 4px solid rgba(255,255,255,0.3);
                                            animation: ripple 1s ease-out infinite;"></div>
                            </div>
                            
                            <h3 style="margin: 0 0 1rem 0; font-size: 2.8rem; font-weight: 900;
                                       text-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                                Message Delivered! 🎉
                            </h3>
                            
                            <p style="margin: 0 0 2rem 0; font-size: 1.2rem; opacity: 0.95;">
                                Your message has been sent successfully
                            </p>
                            
                            <div style="background: rgba(255,255,255,0.25); padding: 2rem; border-radius: 25px; 
                                        margin: 2rem 0; backdrop-filter: blur(10px);
                                        border: 2px solid rgba(255,255,255,0.2);">
                                <div style="margin-bottom: 1rem;">
                                    <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.3rem;">FROM</div>
                                    <div style="font-size: 1.3rem; font-weight: 700;">👤 ${name}</div>
                                    <div style="font-size: 1rem; opacity: 0.9; margin-top: 0.3rem;">📧 ${email}</div>
                                </div>
                                <div style="width: 60%; height: 2px; background: rgba(255,255,255,0.3); 
                                           margin: 1.5rem auto;"></div>
                                <div>
                                    <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.3rem;">SUBJECT</div>
                                    <div style="font-size: 1.2rem; font-weight: 600;">💬 ${subject}</div>
                                </div>
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.2); padding: 1.5rem; border-radius: 20px;
                                        margin: 2rem 0; border: 1px solid rgba(255,255,255,0.2);">
                                <p style="margin: 0; font-size: 1.15rem; font-weight: 600;">
                                    📬 Sent to: devnest.company.tech25@gmail.com
                                </p>
                            </div>
                            
                            <p style="margin: 2rem 0 0 0; font-size: 1.2rem; opacity: 0.95; font-weight: 600;">
                                We'll reply within <strong style="font-size: 1.4rem;">24 hours</strong>! ⚡
                            </p>
                            
                            <button onclick="this.parentElement.parentElement.remove()" 
                                    style="margin-top: 2.5rem; padding: 1.2rem 3.5rem; 
                                           background: white; color: #4ade80; 
                                           border: none; border-radius: 50px; 
                                           font-weight: 900; cursor: pointer; font-size: 1.2rem;
                                           transition: all 0.3s ease; 
                                           box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                                           text-transform: uppercase; letter-spacing: 2px;">
                                AWESOME! ✨
                            </button>
                        </div>
                        
                        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                    background: rgba(0,0,0,0.92); z-index: 9999; 
                                    backdrop-filter: blur(12px);
                                    animation: fadeIn 0.4s ease;" 
                             onclick="this.parentElement.remove()"></div>
                        
                        <style>
                            @keyframes successPop {
                                0% { 
                                    transform: translate(-50%, -50%) scale(0.5) rotate(-5deg); 
                                    opacity: 0; 
                                }
                                70% { 
                                    transform: translate(-50%, -50%) scale(1.05) rotate(2deg); 
                                }
                                100% { 
                                    transform: translate(-50%, -50%) scale(1) rotate(0deg); 
                                    opacity: 1; 
                                }
                            }
                            @keyframes checkSpin {
                                0% { 
                                    transform: scale(0) rotate(-180deg); 
                                    opacity: 0; 
                                }
                                50% { 
                                    transform: scale(1.2) rotate(10deg); 
                                }
                                100% { 
                                    transform: scale(1) rotate(0deg); 
                                    opacity: 1; 
                                }
                            }
                            @keyframes ripple {
                                0% {
                                    width: 140px;
                                    height: 140px;
                                    opacity: 0.6;
                                }
                                100% {
                                    width: 200px;
                                    height: 200px;
                                    opacity: 0;
                                }
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        </style>
                    `;
                document.body.appendChild(successMsg);

                // Reset form
                e.target.reset();

                // Console log for verification
                console.log('✅ EMAIL SENT SUCCESSFULLY!');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📧 To: devnest.company.tech25@gmail.com');
                console.log('👤 From:', name);
                console.log('📧 Reply-to:', email);
                console.log('📋 Subject:', subject);
                console.log('💬 Message:', message);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            } else {
                throw new Error('Failed to send');
            }

        } catch (error) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';

            // Error with helpful instructions
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                background: linear-gradient(135deg, #ef4444, #dc2626); 
                                padding: 3.5rem 4.5rem; border-radius: 35px; z-index: 10000;
                                box-shadow: 0 35px 90px rgba(239, 68, 68, 0.7);
                                text-align: center; color: white; border: 3px solid rgba(255,255,255,0.2);">
                        
                        <i class="fas fa-exclamation-triangle" 
                           style="font-size: 6rem; margin-bottom: 2rem; animation: shake 0.5s ease;"></i>
                        
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 2.5rem; font-weight: 900;">
                            Setup Required 🔧
                        </h3>
                        
                        <p style="margin: 1rem 0 2rem 0; font-size: 1.2rem; opacity: 0.95;">
                            To receive emails, complete this quick setup:
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.2); padding: 2rem; border-radius: 25px;
                                    margin: 2rem 0; text-align: left; backdrop-filter: blur(10px);">
                            <div style="margin-bottom: 1rem;">
                                <strong style="font-size: 1.3rem;">📝 Quick Steps:</strong>
                            </div>
                            <ol style="padding-left: 1.5rem; line-height: 2.2; font-size: 1.1rem;">
                                <li>Go to: <strong>usebasin.com</strong></li>
                                <li>Click "Get Started Free"</li>
                                <li>Enter: <strong>devnest.company.tech25@gmail.com</strong></li>
                                <li>267ce6427de6</li>
                                <li>Share it with developer to update code</li>
                            </ol>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 20px;
                                    margin: 2rem 0;">
                            <p style="margin: 0 0 0.5rem 0; font-size: 0.95rem; opacity: 0.9;">
                                Meanwhile, contact us at:
                            </p>
                            <p style="margin: 0; font-size: 1.3rem; font-weight: 700;">
                                📧 devnest.company.tech25@gmail.com
                            </p>
                        </div>
                        
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="margin-top: 2rem; padding: 1.2rem 3.5rem; background: white; 
                                       color: #ef4444; border: none; border-radius: 50px; 
                                       font-weight: 900; cursor: pointer; font-size: 1.2rem;
                                       text-transform: uppercase; letter-spacing: 2px;">
                            GOT IT!
                        </button>
                    </div>
                    
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                background: rgba(0,0,0,0.92); z-index: 9999; backdrop-filter: blur(12px);" 
                         onclick="this.parentElement.remove()"></div>
                    
                    <style>
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-10px); }
                            75% { transform: translateX(10px); }
                        }
                    </style>
                `;
            document.body.appendChild(errorMsg);

            console.error('❌ Setup required. Please configure Basin form.');
        }
    });