/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OdooFile } from './types';

export const odooModuleFiles: OdooFile[] = [
  {
    path: 'internal_asset_booking/__manifest__.py',
    filename: '__manifest__.py',
    language: 'python',
    description: 'Manifest file containing meta-information about the Odoo 17 module, dependencies, paths to XML files, and security CSVs.',
    content: `# -*- coding: utf-8 -*-
{
    'name': 'Internal Asset Booking',
    'version': '17.0.1.0.0',
    'summary': 'Sistem peminjaman aset internal secara sirkular dan real-time.',
    'description': """
        Modul khusus untuk mengelola peminjaman aset internal perusahaan secara efisien.
        Dilengkapi dengan validasi anti-overbooking datetime (Overlapping constraint) menggunakan native Odoo ORM,
        tampilan interaktif Kalender (Calendar View), List, dan Form yang bersih.
    """,
    'category': 'Operations',
    'author': 'Odoo 17 Technical Expert',
    'website': 'https://ai.studio/build',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/asset_master_views.xml',
        'views/asset_booking_views.xml',
        'views/menu_views.xml',
    ],
    'demo': [],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
`
  },
  {
    path: 'internal_asset_booking/__init__.py',
    filename: '__init__.py',
    language: 'python',
    description: 'Initializes the Python pakage by loading the models package, which handles database mappings.',
    content: `# -*- coding: utf-8 -*-

from . import models
`
  },
  {
    path: 'internal_asset_booking/models/__init__.py',
    filename: '__init__.py',
    language: 'python',
    description: 'Models initialization file routing Odoo 17 models to their respective class definitions.',
    content: `# -*- coding: utf-8 -*-

from . import asset_master
from . import asset_booking
`
  },
  {
    path: 'internal_asset_booking/models/asset_master.py',
    filename: 'asset_master.py',
    language: 'python',
    description: 'Defines the main Asset Master model representation mapping directly to postgres database asset_master table.',
    content: `# -*- coding: utf-8 -*-

from odoo import models, fields, api

class AssetMaster(models.Model):
    _name = 'asset.master'
    _description = 'Master Data Aset'
    _order = 'name ascending'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(
        string='Nama Aset', 
        required=True, 
        tracking=True
    )
    code = fields.Char(
        string='Kode Aset', 
        required=True, 
        copy=False, 
        default='/',
        tracking=True
    )
    category = fields.Selection([
        ('room', 'Ruang Rapat'),
        ('vehicle', 'Kendaraan Operasional'),
        ('equipment', 'Alat Elektronik & Gadget'),
        ('other', 'Kebutuhan Lainnya')
    ], string='Kategori', required=True, default='room', tracking=True)
    
    description = fields.Text(string='Deskripsi Detil')
    active = fields.Boolean(string='Aktif', default=True, tracking=True)
    
    _sql_constraints = [
        ('code_unique', 'unique(code)', 'Kode Aset harus unik dan belum terdaftar!')
    ]

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('code', '/') == '/':
                # Generate simple generic asset prefix for illustration
                vals['code'] = 'AST/' + fields.Datetime.now().strftime('%y%m%d%H%M%S')
        return super(AssetMaster, self).create(vals_list)
`
  },
  {
    path: 'internal_asset_booking/models/asset_booking.py',
    filename: 'asset_booking.py',
    language: 'python',
    description: 'Transaction Booking model. Features precise back-end overlapping datetime check via database index / ORM constraints.',
    content: `# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError

class AssetBooking(models.Model):
    _name = 'asset.booking'
    _description = 'Transaksi Peminjaman Aset'
    _order = 'start_datetime descending'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    asset_id = fields.Many2one(
        'asset.master', 
        string='Aset', 
        required=True, 
        ondelete='restrict', 
        tracking=True,
        domain="[('active', '=', True)]"
    )
    
    borrower_name = fields.Char(
        string='Nama Peminjam', 
        required=True, 
        tracking=True
    )
    
    whatsapp_number = fields.Char(
        string='Nomor WhatsApp', 
        required=True, 
        tracking=True,
        help="Gunakan kode negara, contoh: 628123456789"
    )
    
    start_datetime = fields.Datetime(
        string='Waktu Mulai', 
        required=True, 
        default=fields.Datetime.now,
        tracking=True
    )
    
    end_datetime = fields.Datetime(
        string='Waktu Selesai', 
        required=True, 
        default=lambda self: fields.Datetime.now(),
        tracking=True
    )
    
    purpose = fields.Text(
        string='Keperluan / Deskripsi', 
        required=True
    )
    
    state = fields.Selection([
        ('draft', 'Pengajuan'),
        ('confirmed', 'Disetujui'),
        ('cancelled', 'Dibatalkan')
    ], string='Status', default='draft', tracking=True)

    @api.constrains('start_datetime', 'end_datetime', 'asset_id')
    def _check_overlapping_bookings(self):
        """
        ORM-level check to guarantee zero-conflict schedules.
        Optimized performance with search_count() instead of loading entire records.
        """
        for record in self:
            # Pastikan relasi model, waktu mulai dan waktu selesai diisi dengan benar
            if not record.asset_id or not record.start_datetime or not record.end_datetime:
                continue
                
            if record.start_datetime >= record.end_datetime:
                raise ValidationError("Waktu Mulai harus lebih awal daripada Waktu Selesai!")
            
            # Domain pencarian untuk irisan waktu (Overlap):
            # 1. Mengincar aset yang sama
            # 2. Mengabaikan record yang sedang divalidasi ini (untuk kasus Edit/Update)
            # 3. Logika Overlap: Waktu Mulai Booking Lain < Waktu Selesai Booking Ini
            #    DAN Waktu Selesai Booking Lain > Waktu Mulai Booking Ini
            domain = [
                ('asset_id', '=', record.asset_id.id),
                ('id', '!=', record.id),
                ('start_datetime', '<', record.end_datetime),
                ('end_datetime', '>', record.start_datetime),
                ('state', '!=', 'cancelled') # Abaikan booking yang sudah dibatalkan
            ]
            
            # Meminimalkan pemakaian memori dengan search_count 
            overlap_count = self.env['asset.booking'].search_count(domain)
            
            if overlap_count > 0:
                raise ValidationError(
                    f"Konflik Jadwal detect! Aset '{record.asset_id.name}' sudah dibooking oleh peminjam lain "
                    "pada rentang waktu tersebut. Silakan pilih jadwal atau aset lain."
                )

    def action_confirm(self):
        self.write({'state': 'confirmed'})

    def action_cancel(self):
        self.write({'state': 'cancelled'})

    def action_draft(self):
        self.write({'state': 'draft'})
`
  },
  {
    path: 'internal_asset_booking/security/ir.model.access.csv',
    filename: 'ir.model.access.csv',
    language: 'csv',
    description: 'Defines total read, write, create, and delete rights for the Odoo admin group on both custom models.',
    content: `id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_asset_master_admin,access.asset.master.admin,model_asset_master,base.group_user,1,1,1,1
access_asset_booking_admin,access.asset.booking.admin,model_asset_booking,base.group_user,1,1,1,1
`
  },
  {
    path: 'internal_asset_booking/views/asset_master_views.xml',
    filename: 'asset_master_views.xml',
    language: 'xml',
    description: 'XML layout mapping for the asset inventory (Form view, Search options, List/Tree view).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Asset Master Tree View -->
    <record id="view_asset_master_tree" model="ir.ui.view">
        <name>asset.master.tree</name>
        <model>asset.master</model>
        <arch type="xml">
            <tree string="Daftar Aset Perusahaan" duplicate="0">
                <field name="code"/>
                <field name="name"/>
                <field name="category" decoration-info="category == 'room'" decoration-warning="category == 'vehicle'" decoration-success="category == 'equipment'"/>
                <field name="active" widget="boolean_toggle"/>
            </tree>
        </arch>
    </record>

    <!-- Asset Master Form View -->
    <record id="view_asset_master_form" model="ir.ui.view">
        <name>asset.master.form</name>
        <model>asset.master</model>
        <arch type="xml">
            <form string="Formulir Master Aset">
                <sheet>
                    <div class="oe_title">
                        <label for="name" class="oe_edit_only"/>
                        <h1>
                            <field name="name" placeholder="Contoh: Ruang Meeting Ciliwung Lt.3"/>
                        </h1>
                    </div>
                    <group>
                        <group>
                            <field name="code"/>
                            <field name="category"/>
                        </group>
                        <group>
                            <field name="active"/>
                        </group>
                    </group>
                    <notebook>
                        <page string="Keterangan &amp; Spesifikasi" name="description">
                            <field name="description" placeholder="Spesifikasi hardware, proyektor, kapasitas duduk, AC, dsb."/>
                        </page>
                    </notebook>
                </sheet>
                <div class="oe_chatter">
                    <field name="message_follower_ids" widget="mail_followers"/>
                    <field name="activity_ids" widget="mail_activity"/>
                    <field name="message_ids" widget="mail_thread"/>
                </div>
            </form>
        </arch>
    </record>

    <!-- Asset Master Search View -->
    <record id="view_asset_master_search" model="ir.ui.view">
        <name>asset.master.search</name>
        <model>asset.master</model>
        <arch type="xml">
            <search string="Cari Aset">
                <field name="name"/>
                <field name="code"/>
                <filter string="Tipe Ruangan" name="filter_room" domain="[('category', '=', 'room')]"/>
                <filter string="Tipe Kendaraan" name="filter_vehicle" domain="[('category', '=', 'vehicle')]"/>
                <filter string="Tipe Elektronik" name="filter_equipment" domain="[('category', '=', 'equipment')]"/>
                <filter string="Non-Aktif" name="filter_inactive" domain="[('active', '=', False)]"/>
                <group expand="0" string="Group By">
                    <filter string="Kategori" name="group_by_category" context="{'group_by': 'category'}"/>
                </group>
            </search>
        </arch>
    </record>

    <!-- Asset Master Window Action -->
    <record id="action_asset_master" model="ir.actions.act_window">
        <name>Master Aset</name>
        <res_model>asset.master</res_model>
        <view_mode>tree,form</view_mode>
        <search_view_id ref="view_asset_master_search"/>
        <help type="html">
            <p class="o_view_nocontent_smiling_face">
                Tambahkan aset pertama Anda!
            </p>
            <p>
                Daftarkan ruang meeting, mobil kantor, laptop, atau inventaris lainnya yang bisa dipinjam.
            </p>
        </help>
    </record>
</odoo>
`
  },
  {
    path: 'internal_asset_booking/views/asset_booking_views.xml',
    filename: 'asset_booking_views.xml',
    language: 'xml',
    description: 'Booking view mappings incorporating Odoo 17 calendar layout configured as primary view mode, list tree, and standard form.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Asset Booking Calendar View (DEFAULT VIEW) -->
    <record id="view_asset_booking_calendar" model="ir.ui.view">
        <name>asset.booking.calendar</name>
        <model>asset.booking</model>
        <arch type="xml">
            <calendar string="Jadwal Booking Aset" 
                      date_start="start_datetime" 
                      date_stop="end_datetime" 
                      color="asset_id" 
                      form_view_id="%(view_asset_booking_form)d"
                      quick_create="true"
                      mode="month" 
                      event_limit="5">
                <!-- Field untuk dimunculkan pada bubble tooltip visual event -->
                <field name="borrower_name"/>
                <field name="asset_id"/>
                <field name="whatsapp_number"/>
                <field name="state" filters="1"/>
            </calendar>
        </arch>
    </record>

    <!-- Asset Booking Tree/List View -->
    <record id="view_asset_booking_tree" model="ir.ui.view">
        <name>asset.booking.tree</name>
        <model>asset.booking</model>
        <arch type="xml">
            <tree string="Daftar Peminjaman Aset"
                  decoration-muted="state == 'cancelled'"
                  decoration-info="state == 'draft'"
                  decoration-success="state == 'confirmed'">
                <field name="asset_id"/>
                <field name="borrower_name"/>
                <field name="whatsapp_number" class="font-bold"/>
                <field name="start_datetime" widget="datetime"/>
                <field name="end_datetime" widget="datetime"/>
                <field name="state" 
                       widget="badge" 
                       decoration-muted="state == 'cancelled'"
                       decoration-info="state == 'draft'"
                       decoration-success="state == 'confirmed'"/>
            </tree>
        </arch>
    </record>

    <!-- Asset Booking Form View -->
    <record id="view_asset_booking_form" model="ir.ui.view">
        <name>asset.booking.form</name>
        <model>asset.booking</model>
        <arch type="xml">
            <form string="Formulir Transaksi Peminjaman">
                <header>
                    <button name="action_confirm" 
                            string="Setujui Booking" 
                            type="object" 
                            class="oe_highlight" 
                            invisible="state != 'draft'"/>
                    <button name="action_cancel" 
                            string="Batalkan" 
                            type="object" 
                            class="btn-danger"
                            invisible="state == 'cancelled'"/>
                    <button name="action_draft" 
                            string="Set Draft/Pengajuan" 
                            type="object" 
                            invisible="state == 'draft'"/>
                    <field name="state" widget="statusbar" statusbar_visible="draft,confirmed,cancelled"/>
                </header>
                <sheet>
                    <div class="oe_title">
                        <label for="borrower_name" class="oe_edit_only"/>
                        <h1>
                            <field name="borrower_name" placeholder="Nama Lengkap Peminjam..."/>
                        </h1>
                    </div>
                    <group>
                        <group string="Informasi Aset &amp; Kontak">
                            <field name="asset_id" options="{'no_open': False, 'no_create': True}"/>
                            <field name="whatsapp_number" placeholder="Contoh: 628571234567"/>
                        </group>
                        <group string="Detail Waktu Booking">
                            <field name="start_datetime" widget="datetime"/>
                            <field name="end_datetime" widget="datetime"/>
                        </group>
                    </group>
                    <notebook>
                        <page string="Tujuan Penggunaan" name="purpose">
                            <field name="purpose" placeholder="Deskripsikan agenda meeting, tujuan penugasan, atau keperluan peminjaman aset lainnya..."/>
                        </page>
                    </notebook>
                </sheet>
                <div class="oe_chatter">
                    <field name="message_follower_ids" widget="mail_followers"/>
                    <field name="activity_ids" widget="mail_activity"/>
                    <field name="message_ids" widget="mail_thread"/>
                </div>
            </form>
        </arch>
    </record>

    <!-- Asset Booking Search View -->
    <record id="view_asset_booking_search" model="ir.ui.view">
        <name>asset.booking.search</name>
        <model>asset.booking</model>
        <arch type="xml">
            <search string="Cari Booking">
                <field name="borrower_name"/>
                <field name="asset_id"/>
                <field name="whatsapp_number"/>
                <filter string="Pengajuan (Draft)" name="filter_draft" domain="[('state', '=', 'draft')]"/>
                <filter string="Status Disetujui" name="filter_confirmed" domain="[('state', '=', 'confirmed')]"/>
                <filter string="Dibatalkan" name="filter_cancelled" domain="[('state', '=', 'cancelled')]"/>
                <group expand="0" string="Group By">
                    <filter string="Aset" name="group_by_asset" context="{'group_by': 'asset_id'}"/>
                    <filter string="Status" name="group_by_state" context="{'group_by': 'state'}"/>
                </group>
            </search>
        </arch>
    </record>

    <!-- Asset Booking Window Action (Memprioritaskan Calendar view sebagai default) -->
    <record id="action_asset_booking" model="ir.actions.act_window">
        <name>Booking &amp; Peminjaman</name>
        <res_model>asset.booking</res_model>
        <view_mode>calendar,tree,form</view_mode>
        <search_view_id ref="view_asset_booking_search"/>
        <help type="html">
            <p class="o_view_nocontent_smiling_face">
                Buat booking aset pertama Anda!
            </p>
            <p>
                Gunakan tampilan Kalender untuk melihat ketersediaan aset secara komprehensif,
                lalu klik langsung pada tanggal/jam untuk quick booking.
            </p>
        </help>
    </record>
</odoo>
`
  },
  {
    path: 'internal_asset_booking/views/menu_views.xml',
    filename: 'menu_views.xml',
    language: 'xml',
    description: 'Menu hierachical layout defining the custom apps top bar and subitem entry points in Odoo backend.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Menu Utama Aplikasi (Top Bar) -->
    <menuitem id="menu_asset_booking_root"
              name="Asset Booking"
              web_icon="internal_asset_booking,static/description/icon.png"
              sequence="10"/>

    <!-- Kategori Menu Samping (Sidebar Section) -->
    <menuitem id="menu_asset_booking_operations"
              name="Transaksi"
              parent="menu_asset_booking_root"
              sequence="10"/>

    <menuitem id="menu_asset_booking_configuration"
              name="Konfigurasi"
              parent="menu_asset_booking_root"
              sequence="100"/>

    <!-- Sub-Menu (Action Links) -->
    <menuitem id="menu_action_asset_booking"
              name="Daftar Booking"
              parent="menu_asset_booking_operations"
              action="action_asset_booking"
              sequence="10"/>

    <menuitem id="menu_action_asset_master"
              name="Inventaris Aset"
              parent="menu_asset_booking_configuration"
              action="action_asset_master"
              sequence="10"/>
</odoo>
`
  }
];
