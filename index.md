---
layout: default
title: Home
---

<section class="hero-section">
    <canvas id="animation-canvas"></canvas>
    <div class="background-overlay"></div>
    <div class="content-overlay">
        <div class="profile-image">
            <img src="assets/images/me.jpeg" alt="Profile">
        </div>
        <h1>{{ site.title }}</h1>
        <p>{{ site.description }}</p>
        <div class="social-links">
            {% if site.social.github %}
            <a href="https://github.com/{{ site.social.github }}" target="_blank">GitHub</a>
            {% endif %}
            {% if site.social.linkedin %}
            <a href="https://linkedin.com/in/{{ site.social.linkedin }}" target="_blank">LinkedIn</a>
            {% endif %}
        </div>
    </div>
</section>

<section class="about-section">
    <div class="about-content">
      <h1>About</h1>
      <p>
        Under construction...
      </p>
    </div>
</section>