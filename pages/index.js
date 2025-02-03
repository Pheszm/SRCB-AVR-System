import Head from "next/head";
import { useState } from "react";


export default function Home() {



  return (
    <div>
      <Head>
      <title>SRCB AVR | Reservation & Inventory Management System</title>
      </Head>

      <>
  <header id="header" className="header d-flex align-items-center fixed-top">
    <div className="container-fluid container-xl position-relative d-flex align-items-center">
      <a href="" className="logo d-flex align-items-center me-auto text-decoration-none">
        <img src="assets/img/AVR_Logo_White.png" alt="" />
        <h1 className="sitename">SRCB</h1>
      </a>
      <nav id="navmenu" className="navmenu">
        <ul>
          <li>
            <a href="#hero">
              Home
            </a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#team">Team</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <i className="mobile-nav-toggle d-xl-none bi bi-list" />
      </nav>
      <a className="btn-getstarted text-decoration-none" href="#hero">
        Login
      </a>
    </div>
  </header>
  <main className="main" id="index-page">
    {/* Hero Section */}
    <section
      id="hero"
      className="hero section dark-background"
      style={{
        backgroundImage: "url(assets/img/HeroBackImage.png)",
        backgroundBlendMode: "multiply"
      }}
    >
      <div className="container">
        <div className="row gy-4">
          <div
            className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
            <h1>Reservation & Inventory Management System</h1>
            <p>
            Simplifying the Reservation and Inventory<br/> Management of the Audio Visual Room
            </p>
            <div className="d-flex">
              <a href="#about" className="btn-get-started text-decoration-none">
                Get Started
              </a>
              <a
                href="https://www.youtube.com/watch?v=aRQgMVM-p9s&t=30s"
                className="glightbox btn-watch-video d-flex align-items-center text-decoration-none"
              >
                <i className="bi bi-play-circle" />
                <span>Video Tutorial</span>
              </a>
            </div>
          </div>
          <div
            className="col-lg-6 order-1 order-lg-2 hero-img"

          >
            <img
              src="assets/img/HeroImage.png"
              className="img-fluid animated"
              alt=""
            />
          </div>
        </div>
        <br />
      </div>
    </section>
    {/* /Hero Section */}

    {/* About Section */}
    <section id="about" className="about section">
      {/* Section Title */}
      <div className="container section-title" >
        <h2>About Us</h2>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-4">
            <div className="col-lg-6" >
            <p>
            Welcome to St. Rita’s College of Balingasag! We are dedicated to empowering students through innovative education in Information Technology. Our project aims to revolutionize inventory management for AVR Inventory Coordinator, streamlining processes with real-time tracking and enhanced data organization. Join us on our journey to improve operational efficiency and support informed decision-making in today's fast-paced business environment.{" "}
            </p>
            <a href="#" className="read-more text-decoration-none ">
              <span>Login Now</span>
              <i className="bi bi-arrow-up" />
            </a>
          </div>

          <div
            className="col-lg-6 content"
          >
            <p>
              Design and develop a comprehensive reservation and inventory management system for AVR Inventory Coordinator.
            </p>
            <ul>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>
                  Availability of necessary resources.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>
                  Established security measures.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>
                  Accuracy of provided data.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
    {/* /About Section */}
    {/* Features Section */}
    <section id="features" className="services section light-background">
      {/* Section Title */}
      <div className="container section-title" >
        <h2>Features</h2>
        <p>
        Our platform offers easy navigation, useful tools, and personalized options to help you work more efficiently. See how our features can support your needs and make your tasks easier.
        </p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-4">
          <div
            className="col-xl-3 col-md-6 d-flex">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-qr-code-scan icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                QR Integration
                </a>
              </h4>
              <p>
              Easily create and scan QR codes for quick access to information and promotions.
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-calendar-check icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                Reservation System
                </a>
              </h4>
              <p>
              Effortlessly book and manage reservations in real time for a smooth experience.
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-box icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Inventory Management
                </a>
              </h4>
              <p>
              Keep track of your stock easily and stay organized in real time.
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-bar-chart icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Reporting Features
                </a>
              </h4>
              <p>
              Get clear reports to help you understand data and make better decisions.
              </p>
            </div>
          </div>
          {/* End Service Item */}
        </div>
      </div>
    </section>
    {/* /Services Section */}
    {/* Call To Action Section */}
    <section
      id="call-to-action"
      className="call-to-action section dark-background"
    >
      <img src="assets/img/cta-bg.jpg" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-xl-9 text-center text-xl-start">
            <h3>Call To Action</h3>
            <p>
            Get started today! Log in to access all our features and make the most of your experience. Everything you need is just a click away. Don’t wait—dive in and see how we can support your success!
            </p>
          </div>
          <div className="col-xl-3 cta-btn-container text-center">
            <a className="cta-btn align-middle text-decoration-none" href="#">
              Call To Action
            </a>
          </div>
        </div>
      </div>
    </section>
    {/* /Call To Action Section */}

     {/* Team Section */}
     <section id="team" className="team section">
      {/* Section Title */}
      <div className="container section-title">
        <h2>PROJECT TEAM</h2>
        <p>
          A dedicated group of students working collaboratively to achieve project goals and deliver successful outcomes.
        </p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="team-member d-flex align-items-start">
              <div className="pic">
                <img
                  src="assets/img/team/CarlProfile.jpeg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="member-info">
                <h4>Carl Wyne S. Gallardo</h4>
                <span>Developer</span>
                <p>
                A skilled developer committed to delivering innovative solutions and enhancing user experiences.
                </p>
                <div className="social">
                  <a href="" target="_blank">
                    <i className="bi bi-github" />
                  </a>
                  <a href="https://www.facebook.com/carlwyne.gallardo.9" target="_blank">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="https://www.instagram.com/pheszm/" target="_blank">
                    <i className="bi bi-instagram" />
                  </a>

                </div>
              </div>
            </div>
          </div>
          {/* End Team Member */}
          <div className="col-lg-6">
            <div className="team-member d-flex align-items-start">
              <div className="pic">
                <img
                  src="assets/img/team/PamelProfile.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="member-info">
                <h4>Pamel T. Naypa</h4>
                <span>Project Manager</span>
                <p>
                  An experienced project manager focused on leading teams, ensuring timely delivery, and achieving project goals.
                </p>
                <div className="social">
                  <a href="" target="_blank">
                    <i className="bi bi-github" />
                  </a>
                  <a href="https://www.facebook.com/pamel14.naypa" target="_blank">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="" target="_blank">
                    <i className="bi bi-instagram" />
                  </a>

                </div>
              </div>
            </div>
          </div>
          {/* End Team Member */}
          <div className="col-lg-6">
            <div className="team-member d-flex align-items-start">
              <div className="pic">
                <img
                  src="assets/img/team/UnknownProfile.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="member-info">
                <h4>Joshua B. Salan</h4>
                <span>Project Analyst</span>
                <p>
                A detail-oriented project analyst dedicated to assessing project performance and providing insights for improvement.
                </p>
                <div className="social">
                  <a href="" target="_blank">
                    <i className="bi bi-github" />
                  </a>
                  <a href="" target="_blank">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="" target="_blank">
                    <i className="bi bi-instagram" />
                  </a>

                </div>
              </div>
            </div>
          </div>
          {/* End Team Member */}
          <div className="col-lg-6">
            <div className="team-member d-flex align-items-start">
              <div className="pic">
                <img
                  src="assets/img/team/UnknownProfile.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="member-info">
                <h4>NAME</h4>
                <span>Project Analyst</span>
                <p>
                  Dolorum tempora officiis odit laborum officiis et et accusamus
                </p>
                <div className="social">
                  <a href="" target="_blank">
                    <i className="bi bi-github" />
                  </a>
                  <a href="" target="_blank">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="" target="_blank">
                    <i className="bi bi-instagram" />
                  </a>

                </div>
              </div>
            </div>
          </div>
          {/* End Team Member */}
        </div>
      </div>
    </section>
    {/* /Team Section */}

    {/* Faq 2 Section */}
    <section id="faq-2" className="faq-2 section light-background">
      {/* Section Title */}
      <div className="container section-title" >
        <h2>Luke 6:38</h2>
        <p>
        “Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you.”        
        </p>
      </div>
      {/* End Section Title */}
    </section>
    {/* /Faq 2 Section */}
    {/* Contact Section */}
    <section id="contact" className="contact section">
      {/* Section Title */}
      <div className="container section-title" >
        <h2>Contact</h2>
        <p>
        We’re here to help! Reach out with any questions or feedback, and our team will get back to you as soon as possible. Your input is important to us!
        </p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-7">
            <form
              action="forms/contact.php"
              method="post"
              className="php-email-form"

            >
              <div className="row gy-4">
                <div className="col-md-6">
                  <label htmlFor="name-field" className="pb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name-field"
                    className="form-control"
                    required=""
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email-field" className="pb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email-field"
                    required=""
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="subject-field" className="pb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    id="subject-field"
                    required=""
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="message-field" className="pb-2">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows={10}
                    id="message-field"
                    required=""
                    defaultValue={""}
                  />
                </div>
                <div className="col-md-12 text-center">
                  <div className="loading">Loading</div>
                  <div className="error-message" />
                  <div className="sent-message">
                    Your message has been sent. Thank you!
                  </div>
                  <button type="submit">Send Message</button>
                </div>
              </div>
            </form>
          </div>
          {/* End Contact Form */}
          <div className="col-lg-5">
            <div className="info-wrap">
              <div
                className="info-item d-flex"
 
              >
                <i className="bi bi-geo-alt flex-shrink-0" />
                <div>
                  <h3>Address</h3>
                  <p>Brgy. 3 Balingasag Mis. Or.</p>
                </div>
              </div>
              {/* End Info Item */}
              <div
                className="info-item d-flex"

              >
                <i className="bi bi-telephone flex-shrink-0" />
                <div>
                  <h3>Call Us</h3>
                  <p>(+63) 987 654 3210</p>
                </div>
              </div>
              {/* End Info Item */}
              <div
                className="info-item d-flex"

              >
                <i className="bi bi-envelope flex-shrink-0" />
                <div>
                  <h3>Email Us</h3>
                  <p>s.ma.ilinsalvador@srcb.edu.ph</p>
                </div>
              </div>
              {/* End Info Item */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.459750289134!2d124.77186077501551!3d8.742738691307613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ffe1f6278f7e77%3A0x6048de1929e6e531!2sSt.%20Rita&#39;s%20College%20of%20Balingasag!5e0!3m2!1sen!2sph!4v1738474831795!5m2!1sen!2sph"
                frameBorder={0}
                style={{ border: 0, width: "100%", height: 270 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* /Contact Section */}
  </main>
  <footer id="footer" className="footer light-background">
    <div className="container footer-top">
      <div className="row gy-4">
        <div className="col-lg-4 col-md-6 footer-about">
          <a href="https://www.facebook.com/groups/290298278641236" target="_blank" className="d-flex align-items-center">
            <span className="sitename">SRCB BSIT</span>
          </a>
          <div className="footer-contact pt-3">
            <p>St. Rita's College of Balingasag</p>
            <p>Brgy. 3 Balingasag Mis. Or.</p>
            <p className="mt-3">
              <strong>Phone:</strong> <span>(+63) 987 654 3210</span>
            </p>
            <p>
              <strong>Email:</strong> <span>info@example.com</span>
            </p>
          </div>
        </div>
        <div className="col-lg-2 col-md-3 footer-links">
          <h4>Useful Links</h4>
          <ul>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#hero">Home</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#about">About us</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#features">Features</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#team">Team</a>
            </li>
          </ul>
        </div>
        <div className="col-lg-2 col-md-3 footer-links">
          <h4>Features</h4>
          <ul>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">QR Integration</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#">Reservation System</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#">Inventory Management</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">Reporting Features</a>
            </li>
          </ul>
        </div>
        <div className="col-lg-4 col-md-12">
          <h4>Follow Us</h4>
          <p>
            Stay connected! Follow us for updates, news, and insights.
          </p>
          <div className="social-links d-flex">

            <a href="https://www.facebook.com/srcbofficial" target="_blank">
              <i className="bi bi-facebook" />
            </a>
            <a href="">
              <i className="bi bi-instagram" />
            </a>

          </div>
        </div>
      </div>
    </div>
    <div className="container copyright text-center mt-4">
      <p>
        © <span>Copyright</span>{" "}
        <strong className="px-1 sitename">
          SRCB AVR Reservation &amp; Inventory Mangement System
        </strong>
        <span>All Rights Reserved</span>
      </p>
    </div>
  </footer>
  {/* Scroll Top */}
  <a
    href="#"
    id="scroll-top"
    className="scroll-top d-flex align-items-center justify-content-center"
  >
    <i className="bi bi-arrow-up-short" />
  </a>

  {/* Vendor JS Files */}
  {/* Main JS File */}
</>






    </div>
  );
}
