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
            <a href="#services">Services</a>
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
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
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
          <div
            className="col-lg-6 content"

          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <ul>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>
                  Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>
                  Duis aute irure dolor in reprehenderit in voluptate velit.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-circle" />{" "}
                <span>Ullamco laboris nisi ut aliquip ex ea commodo</span>
              </li>
            </ul>
          </div>
          <div className="col-lg-6" >
            <p>
            Welcome to St. Rita’s College of Balingasag! We are dedicated to empowering students through innovative education in Information Technology. Our project aims to revolutionize inventory management for AVR Inventory Coordinator, streamlining processes with real-time tracking and enhanced data organization. Join us on our journey to improve operational efficiency and support informed decision-making in today's fast-paced business environment.{" "}
            </p>
            <a href="#" className="read-more text-decoration-none ">
              <span>Read More</span>
              <i className="bi bi-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
    {/* /About Section */}
    {/* Services Section */}
    <section id="services" className="services section light-background">
      {/* Section Title */}
      <div className="container section-title" >
        <h2>Services</h2>
        <p>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
        </p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-4">
          <div
            className="col-xl-3 col-md-6 d-flex">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-activity icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Lorem Ipsum
                </a>
              </h4>
              <p>
                Voluptatum deleniti atque corrupti quos dolores et quas
                molestias excepturi
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-bounding-box-circles icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Sed ut perspici
                </a>
              </h4>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-calendar4-week icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Magni Dolores
                </a>
              </h4>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia
              </p>
            </div>
          </div>
          {/* End Service Item */}
          <div
            className="col-xl-3 col-md-6 d-flex"

          >
            <div className="service-item position-relative">
              <div className="icon">
                <i className="bi bi-broadcast icon" />
              </div>
              <h4>
                <a href="" className="stretched-link text-decoration-none">
                  Nemo Enim
                </a>
              </h4>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis
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
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
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
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
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
                  Explicabo voluptatem mollitia et repellat qui dolorum quasi
                </p>
                <div className="social">
                  <a href="">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="">
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
                  Aut maiores voluptates amet et quis praesentium qui senda para
                </p>
                <div className="social">
                  <a href="">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="">
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
                  Quisquam facilis cum velit laborum corrupti fuga rerum quia
                </p>
                <div className="social">
                  <a href="">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="">
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
                  <a href="">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="">
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
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
          consectetur velit
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
          <a href="index.html" className="d-flex align-items-center">
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
              <i className="bi bi-chevron-right" /> <a href="#">Home</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">About us</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">Services</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#">Terms of service</a>
            </li>
          </ul>
        </div>
        <div className="col-lg-2 col-md-3 footer-links">
          <h4>Our Services</h4>
          <ul>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">Web Design</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#">Web Development</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" />{" "}
              <a href="#">Product Management</a>
            </li>
            <li>
              <i className="bi bi-chevron-right" /> <a href="#">Marketing</a>
            </li>
          </ul>
        </div>
        <div className="col-lg-4 col-md-12">
          <h4>Follow Us</h4>
          <p>
            Cras fermentum odio eu feugiat lide par naso tierra videa magna
            derita valies
          </p>
          <div className="social-links d-flex">

            <a href="">
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
