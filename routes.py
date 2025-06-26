import json
import os
from datetime import datetime
from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app
from utils import load_json_data, save_json_data, get_translation
from chatbot import get_chatbot_response

@app.route('/')
@app.route('/<lang>')
def index(lang='en'):
    content = load_json_data('data/content.json')
    translations = get_translation(lang)
    return render_template('index.html', content=content, lang=lang, t=translations)

@app.route('/events')
@app.route('/events/<lang>')
def events(lang='en'):
    events_data = load_json_data('data/events.json')
    translations = get_translation(lang)
    return render_template('events.html', events=events_data, lang=lang, t=translations)

@app.route('/events/donate/<int:event_id>', methods=['POST'])
def donate(event_id):
    events_data = load_json_data('data/events.json')
    donor_name = request.form.get('donor_name')
    amount = float(request.form.get('amount', 0))
    
    for event in events_data['events']:
        if event['id'] == event_id:
            event['raised_amount'] += amount
            if 'donations' not in event:
                event['donations'] = []
            event['donations'].append({
                'donor_name': donor_name,
                'amount': amount,
                'date': datetime.now().isoformat()
            })
            break
    
    save_json_data('data/events.json', events_data)
    flash('Thank you for your donation!', 'success')
    return redirect(url_for('events'))

@app.route('/events/volunteer/<int:event_id>', methods=['POST'])
def volunteer(event_id):
    events_data = load_json_data('data/events.json')
    volunteer_name = request.form.get('volunteer_name')
    volunteer_email = request.form.get('volunteer_email')
    volunteer_phone = request.form.get('volunteer_phone')
    
    for event in events_data['events']:
        if event['id'] == event_id:
            if 'volunteers' not in event:
                event['volunteers'] = []
            event['volunteers'].append({
                'name': volunteer_name,
                'email': volunteer_email,
                'phone': volunteer_phone,
                'registered_at': datetime.now().isoformat(),
                'attended': False
            })
            break
    
    save_json_data('data/events.json', events_data)
    flash('Thank you for volunteering!', 'success')
    return redirect(url_for('events'))

@app.route('/report')
@app.route('/report/<lang>')
def report_incident(lang='en'):
    translations = get_translation(lang)
    return render_template('report.html', lang=lang, t=translations)

@app.route('/report/submit', methods=['POST'])
def submit_report():
    reports_data = load_json_data('data/reports.json')
    
    new_report = {
        'id': len(reports_data['reports']) + 1,
        'title': request.form.get('title'),
        'description': request.form.get('description'),
        'location': request.form.get('location'),
        'reporter_name': request.form.get('reporter_name'),
        'reporter_email': request.form.get('reporter_email'),
        'reporter_phone': request.form.get('reporter_phone'),
        'submitted_at': datetime.now().isoformat(),
        'status': 'pending',
        'admin_notes': ''
    }
    
    reports_data['reports'].append(new_report)
    save_json_data('data/reports.json', reports_data)
    
    flash('Your report has been submitted successfully. We will review it soon.', 'success')
    return redirect(url_for('report_incident'))

@app.route('/gallery')
@app.route('/gallery/<lang>')
def gallery(lang='en'):
    gallery_data = load_json_data('data/gallery.json')
    translations = get_translation(lang)
    return render_template('gallery.html', gallery=gallery_data, lang=lang, t=translations)

@app.route('/products')
@app.route('/products/<lang>')
def products(lang='en'):
    products_data = load_json_data('data/products.json')
    translations = get_translation(lang)
    return render_template('products.html', products=products_data, lang=lang, t=translations)

@app.route('/products/purchase/<int:product_id>', methods=['POST'])
def purchase_product(product_id):
    products_data = load_json_data('data/products.json')
    customer_name = request.form.get('customer_name')
    customer_email = request.form.get('customer_email')
    customer_phone = request.form.get('customer_phone')
    customer_address = request.form.get('customer_address')
    quantity = int(request.form.get('quantity', 1))
    
    for product in products_data['products']:
        if product['id'] == product_id:
            if 'orders' not in product:
                product['orders'] = []
            product['orders'].append({
                'id': len(product.get('orders', [])) + 1,
                'customer_name': customer_name,
                'customer_email': customer_email,
                'customer_phone': customer_phone,
                'customer_address': customer_address,
                'quantity': quantity,
                'total_amount': product['price'] * quantity,
                'ordered_at': datetime.now().isoformat(),
                'status': 'pending',
                'delivered': False
            })
            break
    
    save_json_data('data/products.json', products_data)
    flash('Your order has been placed successfully!', 'success')
    return redirect(url_for('products'))

@app.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    newsletter_data = load_json_data('data/newsletter.json')
    email = request.form.get('email')
    
    # Check if email already exists
    if email not in [sub['email'] for sub in newsletter_data['subscribers']]:
        newsletter_data['subscribers'].append({
            'email': email,
            'subscribed_at': datetime.now().isoformat(),
            'active': True
        })
        save_json_data('data/newsletter.json', newsletter_data)
        flash('Thank you for subscribing to our newsletter!', 'success')
    else:
        flash('You are already subscribed to our newsletter.', 'info')
    
    return redirect(request.referrer or url_for('index'))

@app.route('/admin')
def admin_dashboard():
    content = load_json_data('data/content.json')
    events = load_json_data('data/events.json')
    reports = load_json_data('data/reports.json')
    gallery = load_json_data('data/gallery.json')
    products = load_json_data('data/products.json')
    newsletter = load_json_data('data/newsletter.json')
    
    return render_template('admin.html', 
                         content=content, 
                         events=events, 
                         reports=reports, 
                         gallery=gallery, 
                         products=products, 
                         newsletter=newsletter)

@app.route('/admin/update_content', methods=['POST'])
def update_content():
    content = load_json_data('data/content.json')
    content['mission'] = request.form.get('mission')
    content['about_text'] = request.form.get('about_text')
    content['contact']['email'] = request.form.get('email')
    content['contact']['phone'] = request.form.get('phone')
    content['contact']['address'] = request.form.get('address')
    
    save_json_data('data/content.json', content)
    flash('Content updated successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/add_event', methods=['POST'])
def add_event():
    events_data = load_json_data('data/events.json')
    
    new_event = {
        'id': len(events_data['events']) + 1,
        'title': request.form.get('title'),
        'description': request.form.get('description'),
        'location': request.form.get('location'),
        'date': request.form.get('date'),
        'goal_amount': float(request.form.get('goal_amount', 0)),
        'raised_amount': 0,
        'image_url': request.form.get('image_url', ''),
        'created_at': datetime.now().isoformat(),
        'donations': [],
        'volunteers': []
    }
    
    events_data['events'].append(new_event)
    save_json_data('data/events.json', events_data)
    flash('Event added successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/approve_report/<int:report_id>')
def approve_report(report_id):
    reports_data = load_json_data('data/reports.json')
    
    for report in reports_data['reports']:
        if report['id'] == report_id:
            report['status'] = 'approved'
            break
    
    save_json_data('data/reports.json', reports_data)
    flash('Report approved successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/add_gallery_item', methods=['POST'])
def add_gallery_item():
    gallery_data = load_json_data('data/gallery.json')
    
    new_item = {
        'id': len(gallery_data['items']) + 1,
        'title': request.form.get('title'),
        'description': request.form.get('description'),
        'type': request.form.get('type'),  # image, video, article
        'url': request.form.get('url'),
        'thumbnail_url': request.form.get('thumbnail_url', ''),
        'added_at': datetime.now().isoformat()
    }
    
    gallery_data['items'].append(new_item)
    save_json_data('data/gallery.json', gallery_data)
    flash('Gallery item added successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/add_product', methods=['POST'])
def add_product():
    products_data = load_json_data('data/products.json')
    
    new_product = {
        'id': len(products_data['products']) + 1,
        'name': request.form.get('name'),
        'description': request.form.get('description'),
        'price': float(request.form.get('price', 0)),
        'image_url': request.form.get('image_url', ''),
        'available': True,
        'added_at': datetime.now().isoformat(),
        'orders': []
    }
    
    products_data['products'].append(new_product)
    save_json_data('data/products.json', products_data)
    flash('Product added successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get('message', '')
    response = get_chatbot_response(user_message)
    return jsonify({'response': response})

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500
