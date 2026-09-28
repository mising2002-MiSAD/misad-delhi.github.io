/* =====================================================================
   MiSAD WEBSITE — CONTENT FILE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit for routine updates:
   new photos, a new executive body, a new Lolad edition, contact links.

   Rules that keep the site working:
   1. Every text value sits inside "double quotes".
   2. Every item in a list ends with a comma.
   3. If you need a double quote inside a text, write \"  (backslash quote).
   4. File paths are case-sensitive: "images/Photo1.jpg" is not
      the same as "images/photo1.jpg".
   5. After saving, open the site and check the section you changed.
   ===================================================================== */

window.MISAD = {

  /* ---------- Basic information ---------- */
  site: {
    name: "Mising Students' Association, Delhi",
    short: "MiSAD",
    motto: "Excellence with the spirit of service",
    established: 2002,
    currentTenure: "2025–26"
  },

  /* ---------- Contact & social links ----------
     Leave a value as "" to hide it. Only filled-in items are shown. */
  contact: {
    email: "",          // e.g. "misad.delhi@gmail.com"
    phone: "",          // e.g. "+91 98xxxxxxx"
    instagram: "",      // full link, e.g. "https://www.instagram.com/..."
    facebook: "",       // full link
    youtube: "",        // full link
    joinForm: ""        // link to a Google Form for new members, if any
  },

  /* ---------- Programmes ----------
     id: short name used to link photos to a programme (no spaces).
     Descriptions are short drafts. Please review and rewrite them in
     the association's own words. */
  programmes: [
    {
      id: "kangkin-kebang",
      name: "Kangkin Kébang",
      gloss: "Freshmen Social Programme",
      description: "Our welcome for Mising students who have newly arrived in Delhi. Freshers meet their seniors and one another, and find a community in a new city."
    },
    {
      id: "ali-aye-ligang",
      name: "Ali A:yé Lígang",
      gloss: "Mising cultural festival",
      description: "The Mising festival that marks the beginning of the sowing season, celebrated together in Delhi by students living far from home."
    },
    {
      id: "agom-longe",
      name: "Agom Longé",
      gloss: "Language Day",
      description: "A day dedicated to the Mising language, to celebrate it and to encourage its use among Mising students in Delhi."
    },
    {
      id: "language-workshops",
      name: "Language Workshops",
      gloss: "Reading, writing and speaking Mising",
      description: "Hands-on sessions on the Mising language for members who want to read, write and speak it with confidence."
    },
    {
      id: "student-events",
      name: "Student-Oriented Events",
      gloss: "Academic and career support",
      description: "Sessions built around the academic and professional needs of our members."
    }
  ],

  /* ---------- Photo gallery ----------
     1. Upload the photo into the  images/gallery/  folder.
        Keep each photo under 400 KB (see the guide on resizing).
     2. Add one line below for it:
        { src: "images/gallery/kk-2025-01.jpg", caption: "Freshers at Kangkin Kébang", programme: "kangkin-kebang", year: "2025" },
     The first photos in the list appear first on the site.

     The entries marked  sample: true  are placeholders. Delete them
     once real photos are added. */
 gallery: [
    { src: "images/samples/kangkin-kebang-2025-01.jpg", caption: "Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/kangkin-kebang-2025-02.jpg", caption: "Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/kangkin-kebang-2025-03.jpg", caption: "Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/kangkin-kebang-2025-04.jpg", caption: "Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/kangkin-kebang-2025-05.jpg", caption: "Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/kangkin-kebang-2025-06.jpg", caption: "Aipé A:langka, Kangkin Kébang 2025", programme: "kangkin-kebang", year: "2025" },
    { src: "images/samples/misad-23-years.jpg", caption: "Celebrating 23 years of MiSAD", programme: "", year: "2025" },
    { src: "images/samples/home-on-a-plate.jpg", caption: "Home on a plate", programme: "", year: "" },
    { src: "images/samples/busu-dima-silver-jubilee-2026.jpg", caption: "Busu Dima Silver Jubilee celebration, JNU", programme: "", year: "2026" },
    { src: "images/samples/paat-kai-2025-01.jpg", caption: "Paat Kai 2025", programme: "", year: "2025" },
    { src: "images/samples/paat-kai-2025-02.jpg", caption: "Paat Kai 2025", programme: "", year: "2025" },
    { src: "images/samples/aipe-alangka-01.jpg", caption: "Aipé Alangka", programme: "", year: "" },
    { src: "images/samples/aipe-alangka-02.jpg", caption: "Aipé Alangka", programme: "", year: "" },
    { src: "images/samples/aipe-alangka-03.jpg", caption: "Aipé Alangka", programme: "", year: "" },
    { src: "images/samples/aipe-alangka-04.jpg", caption: "Aipé Alangka", programme: "", year: "" },
    { src: "images/samples/cultural-performance-01.jpg", caption: "Cultural performance", programme: "", year: "" },
    { src: "images/samples/misad-meeting-01.jpg", caption: "MiSAD members", programme: "", year: "" },
    { src: "images/samples/misad-meeting-02.jpg", caption: "MiSAD members", programme: "", year: "" },
    { src: "images/samples/misad-felicitation-01.jpg", caption: "MiSAD members", programme: "", year: "" },
    { src: "images/samples/tribute-eternal-voice-of-assam.jpg", caption: "Tribute: The Eternal Voice of Assam", programme: "", year: "" }
  ],

  /* ---------- Lolad (annual souvenir) ----------
     1. Export the souvenir as a PDF (under 25 MB, see the guide).
     2. Upload it into the  lolad/  folder.
     3. Optionally upload a cover image (JPG) into  lolad/  too.
     4. Add an entry at the TOP of this list for the newest edition:
        { edition: "2026–27", pdf: "lolad/lolad-2026-27.pdf", cover: "lolad/lolad-2026-27-cover.jpg", note: "" },
     Without a cover image, the site draws a simple cover automatically. */
  lolad: [
       {edition: "2026–27", pdf: "lolad/lolad-13-2026.pdf", cover: "lolad/lolad-13-2026-cover.jpg", note: "Lolad (13th Issue, 2026)"},
       {edition: "2025–26", pdf: "lolad/lolad-12-2025.pdf", cover: "lolad/lolad-12-2025-cover.jpg", note: "Lolad (12th Issue, 2025)"}
  ],

  /* ---------- Executive body ----------
     Add a new block at the TOP of this list when a new executive
     takes charge. Older tenures stay on the site as an archive.
     photo: optional, e.g. "images/executive/2025-26/president.jpg"
            (square photos, about 600 × 600 px, look best).
     Rows whose name is "" show as "Name to be added".
     The positions below (other than President) are a starting template:
     rename, add or remove them to match MiSAD's actual constitution. */
  executive: [
    {
      tenure: "2025–26",
      members: [
        { role: "President", name: "Hariprasad Doley", photo: "" },
        { role: "Vice President", name: "", photo: "" },
        { role: "General Secretary", name: "", photo: "" },
        { role: "Assistant General Secretary", name: "", photo: "" },
        { role: "Treasurer", name: "", photo: "" }
      ]
    }
  ]
};
