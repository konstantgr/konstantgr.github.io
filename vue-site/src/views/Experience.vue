<template>
  <div class="cv container max-w-[1100px] mx-auto px-5 pb-16">
    <header class="cv-header">
      <h1 class="cv-name"><b>Konstantin</b> Grotov</h1>
      <div class="cv-contact">
        <span><i class="fas fa-map-marker-alt"></i> {{ profile.location }}</span>
        <span v-if="profile.email">
          <i class="fas fa-envelope"></i>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </span>
        <span><i class="fab fa-linkedin"></i> <a :href="profile.social.linkedin" target="_blank" rel="noopener">LinkedIn</a></span>
        <span><i class="fab fa-github"></i> <a :href="profile.social.github" target="_blank" rel="noopener">GitHub</a></span>
        <span><i class="fab fa-google-scholar"></i> <a :href="profile.social.scholar" target="_blank" rel="noopener">Scholar</a></span>
      </div>
    </header>

    <section class="cv-section">
      <div class="cv-section-label">Summary</div>
      <div class="cv-section-content">
        <p class="cv-prose"><Highlighted :text="data.summary" /></p>
        <p v-for="skill in data.skills" :key="skill.label" class="cv-skill">
          <strong>{{ skill.label }}</strong> {{ skill.items }}
        </p>
      </div>
    </section>

    <section class="cv-section">
      <div class="cv-section-label">Work Experience</div>
      <div class="cv-section-content">
        <div v-for="job in data.work" :key="job.org" class="cv-entry">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ job.org }}</span>
          </div>
          <template v-for="role in job.roles" :key="role.title + role.date">
            <div class="cv-entry-row cv-role">
              <span class="cv-entry-subtitle">{{ role.title }} &middot; {{ role.unit }}</span>
              <span class="cv-entry-date">{{ role.date }}</span>
            </div>
            <ul v-if="role.bullets.length" class="cv-bullets">
              <li v-for="bullet in role.bullets" :key="bullet.text">
                <strong v-if="'label' in bullet && bullet.label" class="cv-bullet-label">{{ bullet.label }}.</strong>
                <Highlighted :text="bullet.text" />
                <a v-if="'link' in bullet && bullet.link" :href="bullet.link.url" target="_blank" rel="noopener">
                  ({{ bullet.link.text }})
                </a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </section>

    <section class="cv-section">
      <div class="cv-section-label">Education</div>
      <div class="cv-section-content">
        <div v-for="edu in data.education" :key="edu.org + edu.date" class="cv-entry">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ edu.org }}</span>
            <span class="cv-entry-date">{{ edu.date }}</span>
          </div>
          <span class="cv-entry-subtitle">{{ edu.degree }}</span>
          <div class="cv-entry-note">{{ edu.place }}</div>
        </div>
      </div>
    </section>

    <section class="cv-section">
      <div class="cv-section-label">Publications</div>
      <div class="cv-section-content">
        <p class="cv-prose">
          See the full list on the <router-link to="/research">Research</router-link> page.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Highlighted from '@/components/Highlighted.vue'
import data from '@/data/experience.json'
import profile from '@/data/profile.json'
</script>

<style scoped>
/* CV layout inspired by chjohnkim.github.io/cv */
.cv {
  --accent-section: #ff318c;
  --accent-hover: #ff318c;
  font-size: 14px;
}

.cv-header { padding: 2.5rem 0 1.25rem; }
.cv-name {
  font-size: 32px;
  font-weight: 400;
  margin: 0 0 0.75rem;
  line-height: 1.25;
}
.cv-name b { font-weight: 700; }
.cv-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.5rem;
  color: hsl(var(--muted-foreground));
}
.cv-contact i { margin-right: 0.4rem; font-size: 12px; }
.cv-contact a, .cv-bullets a, .cv-prose a { color: inherit; }
.cv-contact a:hover, .cv-bullets a:hover, .cv-prose a:hover { color: var(--accent-hover); }
.cv-bullets a, .cv-prose a { text-decoration: underline; text-underline-offset: 2px; }

.cv-section {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid hsl(var(--border));
}
.cv-section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--accent-section);
  padding-top: 0.15rem;
}
.cv-section-content { min-width: 0; }

.cv-entry { margin-bottom: 1.4rem; }
.cv-entry:last-child { margin-bottom: 0; }
.cv-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.cv-role { margin-top: 0.15rem; }
.cv-bullets + .cv-role { margin-top: 0.9rem; }
.cv-entry-title { font-weight: 700; font-size: 15px; }
.cv-entry-subtitle {
  display: block;
  font-style: italic;
  color: hsl(var(--muted-foreground));
  margin-top: 0.1rem;
}
.cv-entry-note { color: hsl(var(--muted-foreground)); margin-top: 0.15rem; }
.cv-entry-date {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.cv-bullets {
  margin: 0.4rem 0 0;
  padding-left: 1.1rem;
  color: hsl(var(--muted-foreground));
}
.cv-bullets li { margin: 0.3rem 0; line-height: 1.55; }
.cv-bullet-label { color: hsl(var(--foreground)); font-weight: 600; margin-right: 0.3em; }

.cv-prose { color: hsl(var(--muted-foreground)); margin: 0 0 0.6rem; line-height: 1.7; }
.cv-skill { margin: 0.15rem 0; color: hsl(var(--muted-foreground)); }
.cv-skill strong {
  display: inline-block;
  min-width: 5.5rem;
  color: hsl(var(--foreground));
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.08em;
}

@media (max-width: 700px) {
  .cv-section { grid-template-columns: 1fr; gap: 0.75rem; }
  .cv-entry-row { flex-direction: column; gap: 0.1rem; }
}
</style>
